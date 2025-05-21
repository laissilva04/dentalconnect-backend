const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

class ConsultationRepository {

    async getAllConsultation() {
        const { data, error } = await supabase
            .from('consulta')
            .select(`
                *,
                paciente:user!consulta_paciente_fkey (
                    id,
                    nome,
                    email,
                    avatar
                )
            `);
        if (error) throw new Error(error.message);
        return data;
    }

    /**
     * Cria uma nova consulta no banco de dados
     * @param {Object} consultation 
     */
    async createConsultation(consultation) {
        const { data, error } = await supabase.from('consulta').insert([consultation]);
        if (error) {
            console.error('Erro ao criar consulta:', error.message);
            throw new Error(error.message);
        }
        return data;
    }

    /**
     * Busca uma consulta pelo ID.
     * @param {number} id
     * @returns {Object|null}
     */
    async findById(id) {
        const { data, error } = await supabase
        .from('consulta')
        .select('*')
        .eq('id', id)
        .single(); // Retorna um único registro

        if (error) {
        if (error.code === 'PGRST116') return null; // Caso o local não seja encontrado
        console.error('Erro ao buscar consulta por ID:', error.message);
        throw new Error(error.message);
        }

        return data;
    }

    /**
     * Atualiza uma consulta
     * @param {number} id 
     * @param {Object} updates 
     */
    async updateConsultation(id, updates) {
        const { data, error } = await supabase
            .from('consulta')
            .update(updates)
            .match({ id })
            .single();

        if (error) {
            console.error('Erro ao atualizar consulta:', error.message);
            throw new Error(error.message);
        }

        return data;
    }

    /**
     * Remove uma consulta
     * @param {number} id 
     */
    async deleteConsultation(id) {
        const { data, error } = await supabase
            .from('consulta')
            .delete()
            .match({ id });

        if (error) {
            console.error('Erro ao deletar consulta:', error.message);
            throw new Error(error.message);
        }

        return data;
    }
};

module.exports = ConsultationRepository;