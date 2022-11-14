# Builder
FROM gradle:jdk-alpine AS builder
COPY --chown=gradle:gradle . /app
WORKDIR /app
RUN gradle build

# Runner
FROM eclipse-temurin:19-jre-alpine
COPY --from=builder /app/build/libs/tropes-bingo-backend-1.0.jar /tropes-bingo.jar
CMD ["java", "-jar", "/tropes-bingo.jar"]
