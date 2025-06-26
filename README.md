
Welcome. 

I have developed a VS Code extension that integrates a React-based chat assistant within a WebView panel. The assistant supports markdown,
syntax-highlighted code blocks, and maintains a scrolling chat history between the user and the AI. The core functionality—AI-driven code 
generation via the OpenAI API—is implemented successfully, allowing users to interact with the assistant directly within their coding workspace.
While most features have been included, I was unable to fully implement the @filename and image attachment functionality due to some technical bugs 
and time constraints. With additional time and guidance from my seniors, I am confident I could complete these features as well.

The project is open-source and publicly available for anyone to use or contribute to. The backend is not yet deployed, but I can easily set it up
on a hosting platform if needed. 

Below are the steps to run the project locally on your machine .

1. Clone the repository . 
2. Create a node .env file in the backend folder. Create the following kep pair value in it.
```
OPEN_API = your_open_ai_api
``` 
3. Since the backend is not deployed , first host the backend locally . To do that ,  in the terminal, Run the following commands in order .
```
cd backend
node server
cd ..
```
4. Then open the extensions folder . Manually delete the media folder. Then in terminal -
```
cd extension
code .. 
```
5. This will open the extension in a seperate window . Use F5 or manually run the file. The VS code extension file is working in the extension development host and can be used now . 
6. To use the extension , press "ctrl+shift+p" and navigate or type :
```
Chatbot: Open Chat
```
7. The chatbot will be opened in the right . Ask anything :) 
8. The chatbot saves the entire chat history . The delete button on the top right corner deletes all the history. 

Thank you .  
