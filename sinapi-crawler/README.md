# obras-cost-audit

pip install -r requirements.txt

docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=admin' -p 1433:1433 --name obras-cost-db -d mcr.microsoft.com/mssql/server:2019-latest
