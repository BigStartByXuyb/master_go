set SCRIPT_PATH=%~dp0
set ZDIR=J:\MTSSD\Config\SSD3C\
if exist %ZDIR% (
	xcopy %SCRIPT_PATH%DefaultConfig	%ZDIR%\	/Y
	xcopy %SCRIPT_PATH%Layout.xml	%ZDIR%Configuration\	/Y
	xcopy %SCRIPT_PATH%Language		%ZDIR%Language\			/Y
)