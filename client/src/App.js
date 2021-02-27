import Preview from './Preview';
import axios from "axios";
import React, { Component } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { Button, Card } from 'ui-neumorphism'
import 'ui-neumorphism/dist/index.css'


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFiles: null, // user-selected files
            fileInfos: []
        }
    }

    selectFiles = event => {
        event.preventDefault();
        this.setState({
            selectedFiles: event.target.files
        });
    }

    uploadFiles = () => {
        if (this.state.selectedFiles) {
            const data = new FormData();
            for (let i = 0; i < this.state.selectedFiles.length; i++) {
                data.append('file', this.state.selectedFiles[i]);
            }
            console.log(this.state.selectedFiles)

            axios.post(`http://localhost:5000/upload/${this.state.user_id}`, data)
                .then(res => {
                    console.log(res.statusText)
                })

            //Split into functions
            //Hardcoded so far
            const data_image = { "Image1": [787, 444], "Image2": [638, 359], "Image3": [512, 320] }

            //test input to coordinates retrieval for images
            axios.post('http://localhost:5000/get_final_coordinates', data_image)
                .then(res => {
                    console.log(res)
                    //res.data
                })
        }
    }


    filePreview = () => {
        if (this.state.selectedFiles) {
            const selectedFiles = this.state.selectedFiles;
            const filePreview = [];
            for (let file of selectedFiles) {
                filePreview.push([file, file.name]);
            }
            return (
                <>
                    <Preview previewList={filePreview}></Preview>
                </>
            )
        }
    }

    componentDidMount() {
        this.setState({
            user_id: uuidv4()
        })
    }

    fileSubmit = () => {
        // follows after user has selected image files (this.uploadFiles).
        // takes all input images and pass into algo; 
        // re-route to results page; loading screen while waiting for algo to run
        this.uploadFiles();
        this.props.history.push(`/results/${this.state.user_id}`)
    }

    render() {
        return (

            <header className="App-header">
                <input
                    ref="fileInput"
                    type='file'
                    multiple
                    onChange={this.selectFiles}
                    accept="image/jpeg, image/png"
                    style={{ display: "none" }}
                />
                <Button onClick={() => this.refs.fileInput.click()} class="custom-file-upload">
                    Upload Images Here
                </Button>
                <br />
                <div id='filesContainer'>
                    {this.filePreview()}
                </div>


                <br />
                <Button size='large' rounded color='var(--primary)' type='submit' onClick={this.fileSubmit}>Create my cheatsheet</Button>
            </header>

        )
    }
}

export default App;