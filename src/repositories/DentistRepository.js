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
};

module.exports = DentistRepository;