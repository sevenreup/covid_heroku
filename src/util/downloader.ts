// @ts-ignore
import GitHubBase from 'github-base';
const options = {
    owner: 'CSSEGISandData',
    repo: 'COVID-19',
    branch: 'master'
}

const gitHub = new GitHubBase(options);

export function file(path: string): any {
    return gitHub.get(path);
}