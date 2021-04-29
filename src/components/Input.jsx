import React, { Component } from 'react';

class App extends Component {
    fixMessage = (message) => {
        let mNotDuplicated = ""

        for (let i = 0; i < message.length; i++) {
            if (mNotDuplicated.length === 0 || message.charAt(i) !== mNotDuplicated.charAt(mNotDuplicated.length - 1))
                mNotDuplicated = mNotDuplicated + message.charAt(i)
        }

        return mNotDuplicated
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

    showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()

        reader.onload = async (e) => {
            const text = (e.target.result)
            const data = text.split(/\r\n|\r|\n/)
            const message = this.fixMessage(data[3])

            this.createResponse(data, message)
        };

        if (e.target.files.length > 0)
            reader.readAsText(e.target.files[0])
    }

    render = () => {
        return (
            <div>
                <input type="file" onChange={(e) => this.showFile(e)} />
            </div>
        )
    }
}

export default App;