@REM Maven Wrapper Script
@echo off
setlocal

set MAVEN_VERSION=3.9.6
set MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip
set MAVEN_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%-bin

if not exist "%MAVEN_DIR%\apache-maven-%MAVEN_VERSION%\bin\mvn.cmd" (
    echo Downloading Maven %MAVEN_VERSION%...
    mkdir "%MAVEN_DIR%" 2>NUL
    powershell -Command "Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%MAVEN_DIR%\maven.zip'"
    powershell -Command "Expand-Archive -Path '%MAVEN_DIR%\maven.zip' -DestinationPath '%MAVEN_DIR%'"
    del "%MAVEN_DIR%\maven.zip"
)

"%MAVEN_DIR%\apache-maven-%MAVEN_VERSION%\bin\mvn.cmd" %*
