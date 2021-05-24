import { readStore } from './store'

const download = (filename) => {
    const json = { feedSources: readStore()['feedSources'], interactions: readStore()['interactions'] }
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(json));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


export default download
