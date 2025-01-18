from fastapi import FastAPI, HTTPException

app = FastAPI()

@app.get("/")
def root():
    return {"message" : "Hello World"} 

message2 = "pong"

@app.get("/ping")
def ping():
    if message2 == "pong":
        return {message2}
    else:
        raise HTTPException(status_code=500, detail= "Internal Server Error")