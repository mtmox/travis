
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.ExpandEnvironmentStrings("%USERPROFILE%") & "\Desktop\Card Database.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = oWS.CurrentDirectory & "\start_server.bat"
oLink.WorkingDirectory = oWS.CurrentDirectory
oLink.Description = "Start Card Database Application"
oLink.Save
