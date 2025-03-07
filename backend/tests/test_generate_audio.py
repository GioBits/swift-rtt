import logging
from providers.text2speachModule.textToSpeach import Text2Speech

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger("Text2Speech")

# Set up logging configuration to suppress TTS logs
logging.getLogger("TTS").setLevel(logging.ERROR)

def main():
    # Inicializar el sistema de TTS
    tts_system = Text2Speech()

    # Texto de ejemplo para convertir a voz

    text= '''What is real? You could define real.
    If you mean what you can feel, you can smell,
    you can taste and see. Real is simple electrical signals
    that your brain interprets'''
    
    text2 = '''¿Qué es real? Podrías definir real. 
    Si te refieres a lo que puedes sentir, puedes oler, 
    puedes probar y ver. Real son simples señales eléctricas 
    que interprete tu cerebro.'''

    text3='''Cosa è reale? Potresti definirlo reale.
    Se intendi ciò che puoi sentire, ciò che puoi annusare,
    puoi provare e vedere. I veri segnali elettrici sono semplici
    lascia che il tuo cervello interpreti'''

    text4='''何が本当なのか？本物を定義することはできます。
    感じたり、嗅いだりできるものなら、
    試してみて下さい。現実は単純な電気信号である
    脳に解釈させる'''
    # Generar audio en español
    try:
        logger.info("Generando audio ...")
        audio_bytes = tts_system._generate_audio(text4, 4)

        # Guardar el audio en un archivo WAV
        with open("audio.wav", "wb") as f:
            f.write(audio_bytes)
        logger.info("Audio generado y guardado como 'audio.wav'.")
    except Exception as e:
        logger.error(f"Error al generar audio en español: {e}")

if __name__ == "__main__":
    main()