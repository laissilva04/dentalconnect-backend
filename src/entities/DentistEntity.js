class Dentist {
    constructor(id, created_at, id_usuario, numero_cro) {
        this.id = id;
        this.created_at = created_at;
        this.usuario_id = usuario_id;
        this.numero_cro = numero_cro;
        this.usuario = usuario; 
    }
}

module.exports = Dentist;