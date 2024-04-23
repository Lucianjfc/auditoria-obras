package br.gov.obras.utils;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@Builder
@EqualsAndHashCode
public class PermissionCapsule {
    private String readPermission;
    private String writePermission;
    private String specialPermission;
    private List<String> associated;
}
