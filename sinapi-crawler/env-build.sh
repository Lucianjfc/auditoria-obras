#!/bin/bash

envfile=$1

# Recreate config file
rm -rf ./parsed-env
touch ./parsed-env

# Read each line in .env file
# Each line represents key=value pairs
while read -r line || [[ -n "$line" ]];
do
  # Split env variables by character `=`
  if printf '%s\n' "$line" | grep -q -e '='; then
    varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
  fi

  # Read value of current variable if exists as Environment variable
  value=$(printf '%s\n' "${!varname}")
  # Otherwise use value from .env file
  [[ -z $value ]] && value=${varvalue}
  
  # Append configuration property to JS file
  echo "--build-arg $varname=\"$value\"" >> ./parsed-env
  # echo "export $varname=\$(grep $varname .env | cut -d '=' -f2)" >> ./parsed-env

done < $envfile

current_commit=$(git show-ref --head --hash head)
build_date=$(date "+%Y-%m-%dT%H:%M:%S")

result=$(sed ':a;N;$!ba;s/\n/ /g' ./parsed-env)
echo ${result} > ./parsed-env