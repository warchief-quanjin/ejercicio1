import React, { Component } from 'react';
import '../App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        }
    }

    fixMessage = (message) => {
        let mNotDuplicated = ""

        for (let i = 0; i < message.length; i++) {
            if (mNotDuplicated.length === 0 || message.charAt(i) !== mNotDuplicated.charAt(mNotDuplicated.length - 1))
                mNotDuplicated = mNotDuplicated + message.charAt(i)
        }

        return mNotDuplicated
    }

    checkDuplicatedChar = (message) => {
        let duplicated = false;

        for (let i = 0; i < message.length; i++) {
            if (message.charAt(i) === message.charAt(i + 1))
                duplicated = true
        }

        return duplicated;
    }

    createResponse = (data, message) => {
        const res1 = message.includes(data[1]) ? "SI" : "NO"
        const res2 = message.includes(data[2]) ? "SI" : "NO"

        const element = document.createElement("a");
        const file = new Blob([`${res1}\n`, res2], { type: 'text/plain' });

        element.href = URL.createObjectURL(file);
        element.download = "Secret Code Output.txt";

        document.body.appendChild(element);

        element.click();
    }

    checkDataValidity = (data) => {
        let messages = [];
        const integerRegex = /^[1-9]\d*$/
        const messageCharsRegex = /^[a-zA-Z0-9]+$/

        const controlValues = data[0].split(" ")

        const message = this.fixMessage(data[3])

        if (data.length !== 4)
            messages.push("La cantidad de lineas en el input es invalida");

        if (controlValues.length !== 3) {
            messages.push(`La cantidad de valores de control deben ser 3 y se encontraron ${controlValues.length} valores`);
        } else {
            controlValues.forEach(controlValue => {
                if (!integerRegex.exec(controlValue))
                    messages.push(`El valor de control ${controlValue} no es un entero`);
            });

            const M1 = controlValues[0];
            const M2 = controlValues[1];
            const N = controlValues[2];

            if (M1 < 2 || M1 > 50) {
                messages.push(`El valor de M1 debe ser un numero entre 2 y 50`);
            } else {
                data[1].length.toString() !== M1 && messages.push(`La longitud de M1 es incorrecta`);
            }

            if (M2 < 2 || M2 > 50) {
                messages.push(`El valor de M2 debe ser un numero entre 2 y 50`);
            } else {
                data[2].length.toString() !== M2 && messages.push(`La longitud de M2 es incorrecta`);
            }

            if (N < 3 || N > 5000) {
                messages.push(`El valor de N debe ser un numero entre 3 y 5000`);
            } else {
                data[3].length.toString() !== N && messages.push(`La longitud de N es incorrecta`);
            }

            if (!messageCharsRegex.exec(data[1]) || !messageCharsRegex.exec(data[2]))
                messages.push(`Las instrucciones solo pueden contener los caracteres a-z, A-Z o 0-9`);

            if (!messageCharsRegex.exec(data[3]))
                messages.push(`El mensaje solo puede contener los caracteres a-z, A-Z o 0-9`);

            if (message.includes(data[1]) && message.includes(data[2]))
                messages.push(`El mensaje solo puede contener una instruccion`);

            if (this.checkDuplicatedChar(data[1]) || this.checkDuplicatedChar(data[2]))
                messages.push(`Las instrucciones no pueden tener caracteres duplicados`);
        }

        this.setState({ messages });

        return messages.length === 0;
    }

    showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()

        reader.onload = async (e) => {
            const text = (e.target.result)
            const data = text.split(/\r\n|\r|\n/)

            const validData = this.checkDataValidity(data)

            if (validData) {
                const message = this.fixMessage(data[3])
                this.createResponse(data, message)
            }

            document.getElementById("file-input").value = "";
        };

        if (e.target.files.length > 0)
            reader.readAsText(e.target.files[0])
    }

    render = () => {
        const { messages } = this.state;

        return (
            <div className="App-body">
                <label for="file-input" className="custom-file-input">
                    Desencriptar mensaje
                </label>
                <input type="file" id="file-input" onChange={(e) => this.showFile(e)} />
                {messages && messages.map((message, key) =>
                    <span key={`message-${key}`} className="message">{message}</span>
                )}
            </div>
        )
    }
}

export default App;