const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class LocalRepository {

  /**
   * Retorna todos os locais cadastrados no banco de dados.
   * @returns {Array<Local>}
   */
  async getAllLocais() {
    const { data, error } = await supabase.from('local').select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Cria um novo local no banco de dados.
   * @param {Local} local
   */
  async createLocal(local) {
    const { data, error } = await supabase.from('local').insert([local]);
    if (error) {
      console.error('Erro ao inserir local:', error.message);
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * Busca um local pelo ID.
   * @param {number} id
   * @returns {Object|null}
   */
  async findById(id) {
    const { data, error } = await supabase
      .from('local')
      .select('*')
      .eq('id', id)
      .single(); // Retorna um único registro

    if (error) {
      if (error.code === 'PGRST116') return null; // Caso o local não seja encontrado
      console.error('Erro ao buscar local por ID:', error.message);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Atualiza um local existente no banco de dados.
   * @param {number} id
   * @param {Object} updates
   */
  async updateLocal(id, updates) {
    const { data, error } = await supabase
      .from('local')
      .update(updates)
      .match({ id })
      .single(); // Retorna um único resultado

    if (error) {
      console.error('Erro ao atualizar local:', error.message);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Deleta um local do banco de dados.
   * @param {number} id
   */
  async deleteLocal(id) {
    const { data, error } = await supabase
      .from('local')
      .delete()
      .match({ id });

    if (error) {
      console.error('Erro ao deletar local:', error.message);
      throw new Error(error.message);
    }

    return data;
  }

  /**
   * Busca locais com filtros avançados por estado, cidade e serviço.
   * @param {Object} filtros
   * @param {string} [filtros.estado]
   * @param {string} [filtros.cidade]
   * @param {number} [filtros.servicoId]
   * @returns {Promise<Array>}
   */

  
  async buscarLocaisPorFiltros({ estado, cidade, servicoId }) {
    try {
      let query = supabase
        .from('local')
        .select(`
          id,
          nome,
          endereco,
          numero,
          cidade,
          estado
        `);

      if (estado) {
        query = query.eq('estado', estado);
      }
      
      if (cidade) {
        query = query.eq('cidade', cidade);
      }

      if (servicoId) {
        const { data: consultasComServico, error: erroConsultas } = await supabase
          .from('consulta')
          .select('local')
          .eq('servico', servicoId);
        
        if (erroConsultas) {
          console.error('Erro ao buscar consultas por serviço:', erroConsultas.message);
          throw new Error(erroConsultas.message);
        }
        
        const idsLocais = consultasComServico.map(consulta => consulta.local);
        
        
        if (idsLocais.length > 0) {
          query = query.in('id', idsLocais);
        } else {
          return [];
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro ao buscar locais com filtros:', error.message);
        throw new Error(error.message);
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar locais com filtros:', error.message);
      throw error;
    }
  }


}

module.exports = LocalRepository;