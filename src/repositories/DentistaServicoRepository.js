const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class DentistaServicoRepository {
  /**
   * Retorna todos os dentistas com seus serviços.
   * @returns {Promise<Array<Object>>}
   */
  async findAllWithServices() {
    const { data, error } = await supabase
      .from('dentista_servico')
      .select('*, dentista(*), servicos(*)');

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Retorna os serviços de um dentista específico pelo ID.
   * @param {number} dentistaId
   * @returns {Promise<Array<Object>>}
   */
  async findServicesByDentistId(dentistaId) {
    const { data, error } = await supabase
      .from('dentista_servico')
      .select('*, servicos(*)')
      .eq('dentista', dentistaId);

    if (error) throw new Error(error.message);
    return data;
  }
}

module.exports = DentistaServicoRepository;
