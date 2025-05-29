const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  class userRepository{

    async getAllUsers() {
        const { data, error } = await supabase.from('user').select('*');
        if (error) throw new Error(error.message);
        return data;
      }

    async getUsersByType(tipo) {
        const { data, error } = await supabase.from('user').select('*').eq('tipo', tipo);
        if (error) throw new Error(error.message);
        return data;
      }

    /**
     * Busca um usuário pelo ID.
     * @param {string|number} id 
     * @returns {Object|null} 
     */
    async findById(id) {
        console.log("Buscando usuário no Supabase com ID:", id);
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            console.error("Erro ao buscar usuário no Supabase:", error);
            throw new Error(error.message);
        }
        
        console.log("Dados retornados do Supabase:", data);
        return data;
    }

    /**
     * Cria um novo usuário no banco de dados.
     * @param {Object} user
     */
    async createUser(userData) {
        console.log("Criando usuário no Supabase:", userData);
        const { data, error } = await supabase
            .from('user')
            .insert([userData])
            .select()
            .maybeSingle();
        
        if (error) {
            console.error("Erro ao criar usuário no Supabase:", error);
            throw new Error(error.message);
        }
        
        console.log("Usuário criado no Supabase:", data);
        return data;
    }

    /**
     * Busca um usuário pelo e-mail.
     * @param {string} email 
     * @returns {Object|null} 
     */
    async findByEmail(email) {
        console.log("Buscando usuário no Supabase com email:", email);
        const { data, error } = await supabase
            .from('user')
            .select('*')
            .eq('email', email)
            .maybeSingle();
        
        if (error) {
            console.error("Erro ao buscar usuário por email no Supabase:", error);
            throw new Error(error.message);
        }
        
        console.log("Usuário encontrado por email:", data);
        return data;
    }

    async updateUser(id, userData) {
        console.log("Atualizando usuário no Supabase:", { id, userData });
        const { data, error } = await supabase
            .from('user')
            .update(userData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) {
            console.error("Erro ao atualizar usuário no Supabase:", error);
            throw new Error(error.message);
        }
        
        console.log("Usuário atualizado no Supabase:", data);
        return data;
    }

    async deleteUser(id) {
        console.log("Deletando usuário no Supabase:", id);
        const { error } = await supabase
            .from('user')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error("Erro ao deletar usuário no Supabase:", error);
            throw new Error(error.message);
        }
        
        console.log("Usuário deletado com sucesso");
    }
  }

  module.exports = userRepository;