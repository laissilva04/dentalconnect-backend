const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

class ServicesRepository {

    /**
     * Busca todos os serviços
     * @returns {Array<Service>}
     */
    async getAll() {
        const { data, error } = await supabase.from('servicos').select('*');
        if (error) throw new Error(error.message);
        return data;
    }

    /**
     * Cria um novo serviço
     * @param {Object} service - { nome, descricao }
     */
    async create(service) {
        const { data, error } = await supabase
            .from('servicos')
            .insert([service])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar serviço:', error.message);
            throw new Error(error.message);
        }
        return data;
    }

    /**
     * Busca um serviço por ID
     * @param {number} id 
     * @returns {Object|null} - Serviço ou null se não existir
     */
    async findById(id) {
        const { data, error } = await supabase
            .from('servicos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Registro não encontrado
            console.error('Erro ao buscar serviço:', error.message);
            throw new Error(error.message);
        }
        return data;
    }

    /**
     * Atualiza um serviço
     * @param {number} id 
     * @param {Object} updates - Campos para atualizar (ex: { nome, descricao })
     */
    async update(id, updates) {
        const { data, error } = await supabase
            .from('servicos')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar serviço:', error.message);
            throw new Error(error.message);
        }
        return data;
    }

    /**
     * Remove um serviço
     * @param {number} id 
     */
    async delete(id) {
        const { error } = await supabase
            .from('servicos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro ao deletar serviço:', error.message);
            throw new Error(error.message);
        }
    }

    /**
     * Busca serviços por nome (busca parcial)
     * @param {string} nome 
     * @returns {Array<Object>}
     */
    async searchByName(nome) {
        const { data, error } = await supabase
            .from('servicos')
            .select('*')
            .ilike('nome', `%${nome}%`);

        if (error) {
            console.error('Erro na busca por nome:', error.message);
            throw new Error(error.message);
        }
        return data;
    }
};

module.exports = ServicesRepository;