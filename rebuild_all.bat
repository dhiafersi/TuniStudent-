@echo off
echo Rebuilding all microservices...

echo Building Discovery Server...
cd discovery-server
call mvn clean install -DskipTests
cd ..

echo Building API Gateway...
cd api-gateway
call mvn clean install -DskipTests
cd ..

echo Building User Service...
cd user-service
call mvn clean install -DskipTests
cd ..

echo Building Deal Service...
cd deal-service
call mvn clean install -DskipTests
cd ..

echo Building Notification Service...
cd notification-service
call mvn clean install -DskipTests
cd ..

echo All services rebuilt successfully!
pause
