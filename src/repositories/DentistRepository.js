const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

class DentistRepository {

    async getAllDentists() {
        const { data, error } = await supabase.from('dentista').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    /**
     * Cria um novo dentista no banco de dados
     * @param {Object} dentist 
     */
    async createDentist(dentist) {
        const { data, error } = await supabase.from('dentista').insert([dentist]);
        if (error) {
            console.error('Erro ao inserir dentista:', error.message);
            throw new Error(error.message);
        }
        return data;
    }

    /**
     * Busca um dentista pelo ID do usuário
     * @param {number} id_usuario 
     * @returns {Object|null}
     */
    async findByUserId(id_usuario) {
        const { data, error } = await supabase
            .from('dentista')
            .select('*')
            .eq('id_usuario', id_usuario)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            console.error('Erro ao buscar dentista por id_usuario:', error.message);
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Atualiza um dentista
     * @param {number} id 
     * @param {Object} updates 
     */
    async updateDentist(id, updates) {
        const { data, error } = await supabase
            .from('dentista')
            .update(updates)
            .match({ id })
            .single();

        if (error) {
            console.error('Erro ao atualizar dentista:', error.message);
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Remove um dentista
     * @param {number} id 
     */
    async deleteDentist(id) {
        const { data, error } = await supabase
            .from('dentista')
            .delete()
            .match({ id });

        if (error) {
            console.error('Erro ao deletar dentista:', error.message);
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Busca um dentista pelo número do CRO
     * @param {string} numero_cro 
     * @returns {Object|null}
     */
    async findByCroNumber(numero_cro) {
        const { data, error } = await supabase
            .from('dentista')
            .select('*')
            .eq('numero_cro', numero_cro)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null;
            console.error('Erro ao buscar dentista por número CRO:', error.message);
            throw new Error(error.message);
        }

        return data;
    }


    /**
     * Retorna todos os dentistas com informações do usuário associado.
     * Se um nome for fornecido, filtra os resultados pelo nome do usuário (case-insensitive).
     * @param {string} [nome] - Nome opcional para filtrar os dentistas.
     * @returns {Promise<Array<Object>>}
     */
    async findAllWithUser(nome) {
        console.log("DentistRepository - findAllWithUser - Parâmetro 'nome' recebido:", nome);
        let query = supabase
            .from("dentista")
            .select(`
                id,
                created_at,
                numero_cro,
                tipo,
                id_usuario, 
                usuario:user!inner (
                    id,
                    nome,
                    senha, 
                    data_nascimento,
                    tipo,
                    email,
                    cpf,
                    cidade,
                    estado,
                    cro,
                    created_at,
                    avatar
                )
            `);

        if (nome && nome.trim() !== "") {
            console.log("DentistRepository - findAllWithUser - Aplicando filtro ilike para:", nome);
            query = query.ilike("user.nome", `%${nome.trim()}%`);
        } else {
            console.log("DentistRepository - findAllWithUser - Nenhum nome fornecido ou nome vazio, não aplicando filtro ilike.");
        }

        const { data, error } = await query;

        if (error) {
            console.error("DentistRepository - findAllWithUser - Erro ao buscar dentistas com usuários:", error.message, error.details);
            throw new Error(error.message);
        }
        
        console.log("DentistRepository - findAllWithUser - Dados retornados pela consulta:", data ? data.length : 0, "registos");
        return data.map(d => ({
            id: d.id,
            created_at: d.created_at,
            id_usuario: d.id_usuario, 
            numero_cro: d.numero_cro,
            tipo: d.tipo, 
            usuario: d.usuario 
        }));
    }

    /**
     * Busca um dentista pelo ID com informações do usuário associado.
     * @param {number} id O ID do dentista.
     * @returns {Promise<Object|null>}
     */
    async findByIdWithUser(id) {
        console.log("DentistRepository - findByIdWithUser - ID recebido:", id);
        const { data, error } = await supabase
            .from("dentista")
            .select(`
                id,
                created_at,
                numero_cro,
                tipo,
                id_usuario,
                usuario:user (
                    id,
                    nome,
                    senha,
                    data_nascimento,
                    tipo,
                    email,
                    cpf,
                    cidade,
                    estado,
                    cro,
                    created_at,
                    avatar
                )
            `)
            .eq("id", id)
            .single();

        if (error) {
            if (error.code === "PGRST116") { // Código para "No rows found"
                console.log("DentistRepository - findByIdWithUser - Dentista não encontrado para o ID:", id);
                return null; 
            }
            console.error("DentistRepository - findByIdWithUser - Erro ao buscar dentista por ID com usuário:", error.message, error.details);
            throw new Error(error.message);
        }
        
        console.log("DentistRepository - findByIdWithUser - Dados retornados para o ID:", id, data ? "Encontrado" : "Não encontrado");
        if (!data) return null;

        return {
            id: data.id,
            created_at: data.created_at,
            id_usuario: data.id_usuario,
            numero_cro: data.numero_cro,
            tipo: data.tipo,
            usuario: data.usuario
        };
    }
}


module.exports = DentistRepository;
