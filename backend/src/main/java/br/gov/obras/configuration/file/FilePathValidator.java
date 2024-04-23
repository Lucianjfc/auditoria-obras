package br.gov.obras.configuration.file;

import lombok.NonNull;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.nio.file.Files;
import java.nio.file.Paths;

public class FilePathValidator implements Validator {

    @Override
    public boolean supports(@NonNull Class<?> clazz) {
        return FilePathProperties.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(@NonNull Object target, @NonNull Errors errors) {
        FilePathProperties filePathProperties = (FilePathProperties) target;
        if (!Files.isWritable(Paths.get(filePathProperties.getRepositoryFullPath()))) {
            errors.rejectValue("repositoryFullPath", "field.domain.required",
                    "O caminho especificado para o salvamento de arquivos não existe ou não permite escrita!");
        }
    }
}
