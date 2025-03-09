html = """
<!DOCTYPE html>
<html>
    <head>
        <title>WebSocket</title>
    </head>
    <body>
        <h1>WebSocket</h1>
        <ul id='messages'>
        </ul>
        <script>

            // Obtener el user_id de la URL
            const pathSegments = window.location.pathname.split('/');
            const userId = pathSegments[pathSegments.length - 1]; // Último segmento de la ruta

            // Crear la conexión WebSocket usando el user_id
            var ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
        </script>
    </body>
</html>
"""