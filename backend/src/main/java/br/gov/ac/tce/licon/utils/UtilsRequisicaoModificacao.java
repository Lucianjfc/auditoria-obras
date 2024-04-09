package br.gov.ac.tce.licon.utils;

import br.gov.ac.tce.licon.dtos.requests.ArquivoUploadDTO;
import br.gov.ac.tce.licon.entities.enums.EnumValor;
import br.gov.ac.tce.licon.exceptions.AppException;
import com.bedatadriven.jackson.datatype.jts.parsers.GenericGeometryParser;
import com.bedatadriven.jackson.datatype.jts.serialization.GeometryDeserializer;
import com.bedatadriven.jackson.datatype.jts.serialization.GeometrySerializer;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;

import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

public class UtilsRequisicaoModificacao {

    private static final String MODIFICATION_DEFAULT_ERROR_TEXT = "Ocorreu um erro ao processar as modificações realizadas";

    private static final String INVALID_ATTRIBUTE_ERROR = "A requisição de modificação em questão possui atributos não definidos para o processo";

    public static String toString(LocalDateTime dataEHora) {
        String result = "";
        if (dataEHora != null) {
            DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
            result = df.format(dataEHora);
        }
        return result;
    }

    public static String toString(LocalDate data) {
        String result = "";
        if (data != null) {
            DateTimeFormatter df = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            result = df.format(data);
        }
        return result;
    }

    public static String toString(BigDecimal valor) {
        return NumberFormat.getCurrencyInstance().format(valor).replace("R$\t", "");
    }

    public static String genericToString(Object object, Class type) {
        if (LocalDateTime.class.isAssignableFrom(type)) {
            return toString((LocalDateTime) object);
        } else if (LocalDate.class.isAssignableFrom(type)) {
            return toString((LocalDate) object);
        } else if (BigDecimal.class.isAssignableFrom(type)) {
            if (Integer.class.isAssignableFrom(object.getClass())) {
                object = BigDecimal.valueOf(((Integer) object) * 1.0);
            }
            return toString((BigDecimal) object);
        } else if (object instanceof Boolean && object != null) {
            return (boolean) object ? "Sim" : "Não";
        } else {
            return object.toString();
        }
    }

    public static boolean isEntidadeLiconAntigo(LocalDateTime dataCadastro) {
        LocalDateTime dataProcessosAntigos = LocalDateTime.of(2024, 02, 07, 0, 0, 0);
        return dataCadastro.isBefore(dataProcessosAntigos);
    }

    public static JsonMapper getJsonMapper() {
        GenericGeometryParser genericGeometryParser = new GenericGeometryParser(new GeometryFactory());
        return JsonMapper.builder().addModule(new JavaTimeModule()).configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false).configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false).addModule(new SimpleModule("JSR-310-MongoJack").addSerializer(Geometry.class, new GeometrySerializer()).addDeserializer(Geometry.class, new GeometryDeserializer<>(genericGeometryParser))).defaultDateFormat(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")).build();
    }

    public static Object cloneObject(Object object, Class<?> objectType) throws JsonProcessingException {
        JsonMapper jm = getJsonMapper();
        return jm.readValue(jm.writeValueAsString(object), objectType);
    }

    public static JSONObject mapToJSON(Map<String, Object> map) {
        JSONObject result = new JSONObject();
        map.entrySet().forEach(entry -> result.put(entry.getKey(), entry.getValue()));
        return result;
    }

    public static Boolean equalsJSON(Object json1, Object json2) {
        Boolean result;
        if (Objects.isNull(json1) || Objects.isNull(json2)) {
            result = Objects.isNull(json1) && Objects.isNull(json2);
        } else if (JSONObject.class.isAssignableFrom(json1.getClass()) && JSONObject.class.isAssignableFrom(json2.getClass())) {
            result = Objects.equals(((JSONObject) json1).toMap(), ((JSONObject) json2).toMap());
        } else if (JSONArray.class.isAssignableFrom(json1.getClass()) && JSONArray.class.isAssignableFrom(json2.getClass())) {
            result = Objects.equals(((JSONArray) json1).toList(), ((JSONArray) json2).toList());
        } else {
            result = Objects.equals(json1, json2);
        }

        return result;
    }

    public static Boolean equalsArquivos(List<? extends ArquivoUploadDTO> arquivos1, List<? extends ArquivoUploadDTO> arquivos2) {
        if (arquivos1.size() != arquivos2.size()) {
            return false;
        }

        Collections.sort(arquivos1, (arq1, arq2) -> Math.toIntExact(Optional.ofNullable(arq2.getIdArquivo()).orElse(0L) - Optional.ofNullable(arq1.getIdArquivo()).orElse(0L)));
        Collections.sort(arquivos2, (arq1, arq2) -> Math.toIntExact(Optional.ofNullable(arq2.getIdArquivo()).orElse(0L) - Optional.ofNullable(arq1.getIdArquivo()).orElse(0L)));

        for (int i = 0; i < arquivos1.size(); i++) {
            if (!arquivos1.get(i).getTipo().equals(arquivos2.get(i).getTipo()) ||
                    !arquivos1.get(i).getDescricao().equals(arquivos2.get(i).getDescricao()) ||
                    !arquivos1.get(i).getArquivo().equals(arquivos2.get(i).getArquivo()) ||
                    !arquivos1.get(i).getIdArquivo().equals(arquivos2.get(i).getIdArquivo())) {
                return false;
            }
        }
        return true;
    }
    public static Class<?> getAttrType(Class<?> parent, String attr) {
        try {
            Field field = null;
            Class<?> auxType = parent;
            while (field == null && auxType != null) {
                field = Arrays.stream(auxType.getDeclaredFields()).filter(classField -> classField.getName().equals(attr)).findFirst().orElse(null);
                auxType = auxType.getSuperclass();
            }

            if (field == null) {
                throw new AppException(INVALID_ATTRIBUTE_ERROR, HttpStatus.UNPROCESSABLE_ENTITY);
            }

            Class<?> type = field.getType();
            if (List.class.isAssignableFrom(type) || Set.class.isAssignableFrom(type)) {
                type = Class.forName(((ParameterizedType) field.getGenericType()).getActualTypeArguments()[0].getTypeName());
            }
            return type;
        } catch (ClassNotFoundException e) {
            throw new AppException(MODIFICATION_DEFAULT_ERROR_TEXT, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public static String getString(Object object, String attr, Class<?> parent) throws AppException {
        try {
            Class<?> type = getAttrType(parent, attr);
            if (JSONArray.class.isAssignableFrom(object.getClass()) && !LocalDate.class.isAssignableFrom(type) && !LocalDateTime.class.isAssignableFrom(type)) {
                return ((JSONArray) object).toList().stream().map(value -> {
                    try {
                        value = Map.class.isAssignableFrom(value.getClass()) ? mapToJSON((Map) value) : value;
                        return toStringByClass(value, type);
                    } catch (JsonProcessingException e) {
                        throw new AppException(MODIFICATION_DEFAULT_ERROR_TEXT, HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }).collect(Collectors.joining(", "));
            } else {
                return toStringByClass(object, type);
            }
        } catch (AppException e) {
            throw new AppException(e.getMessage(), e.getHttpStatus());
        } catch (JsonProcessingException e) {
            throw new AppException(MODIFICATION_DEFAULT_ERROR_TEXT, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public static String toStringByClass(Object object, Class type) throws JsonProcessingException {
        if (JSONObject.class.isAssignableFrom(object.getClass()) || JSONArray.class.isAssignableFrom(object.getClass())) {
            JsonMapper jm = getJsonMapper();
            object = jm.readValue(object.toString(), type);
        } else if (EnumValor.class.isAssignableFrom(type)) {
            object = ((EnumValor) Enum.valueOf(type, object.toString())).getValor();
        } else if (LocalDate.class.isAssignableFrom(type)) {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
            object = LocalDate.parse(object.toString(), formatter);
        } else if (LocalDateTime.class.isAssignableFrom(type)) {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            object = LocalDateTime.parse(object.toString(), formatter);
        }
        return genericToString(object, type);
    }

    public static List<String> getAllFieldsByClass(Class<?> type) {
        List<String> attrClassList = Arrays.stream(type.getDeclaredFields()).map(Field::getName).collect(Collectors.toList());
        Class<?> auxType = type;
        while (auxType.getSuperclass() != null) {
            attrClassList.addAll(Arrays.stream(auxType.getSuperclass().getDeclaredFields()).map(Field::getName).collect(Collectors.toList()));
            auxType = auxType.getSuperclass();
        }
        return attrClassList;
    }
}
