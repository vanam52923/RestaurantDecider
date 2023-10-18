
FROM openjdk:8-jre-slim

WORKDIR /app

COPY target/chatroon-backend-0.0.1-SNAPSHOT.jar /app/chatroon-backend-0.0.1-SNAPSHOT.jar

EXPOSE 8080

CMD ["java", "-jar", "chatroon-backend-0.0.1-SNAPSHOT.jar"]