git add * 
git status
@echo off
set /p input="would you like to commit additions? y/n: "
IF /I "%input%" == "y" (
    set /p commit_message="enter a commit message: "    
    git commit -m echo %commit_message%
    
)