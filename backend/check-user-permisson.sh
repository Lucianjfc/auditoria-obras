#!/bin/bash
controllers_dir="./src/main/java/br/gov/ac/tce/licon/controllers"
user_permission_content=$(<./src/main/java/br/gov/ac/tce/licon/services/UserPermissionService.java)
authorized_files="AbstractController,JwtAuthenticationController,NotificacaoController"
code=0
for file_path in "$controllers_dir"/*; do
  file_name=$(basename -- "$file_path")
  file_name="${file_name%.*}"
  file_name_formatted="${file_name}.class.getName()"

  if [[ "$authorized_files" != *"$file_name"* ]]; then
    if [[ "$user_permission_content" != *"$file_name_formatted"* ]]; then
      echo "Permission associated with ${file_name} not found."
      code=1
    fi
  fi
done

if [ $code -eq 1 ]; then
  echo "There is one or more controllers without associated permission."
  echo "Check and fix UserPermissionService.java!"
  exit $code
fi
echo "Successful verification! Everything is OK!"
exit $code