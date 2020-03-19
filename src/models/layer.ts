export default class Layer {
    id: string;
    value: string;
    name: string;

    constructor(id: string, value: string, name: string) {
        this.id = id;
        this.value = value;
        this.name = name;
    }
}
