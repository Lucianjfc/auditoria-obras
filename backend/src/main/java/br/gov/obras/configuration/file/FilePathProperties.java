package br.gov.obras.configuration.file;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotEmpty;

@Data
@Validated
@ConfigurationProperties("app.files")
public class FilePathProperties {

    @NotEmpty
    private String repositoryFullPath;
}
