require("dotenv").config(); 
const { createClient } = require("@supabase/supabase-js"); 


const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

class LocalServicosRepository {
  async getLocaisComServicos() {
    try {
      const { data: locais, error: locaisError } = await supabase
        .from("local")
        .select("*");

      if (locaisError) throw locaisError;

      
      const locaisComServicos = await Promise.all(
        locais.map(async (local) => {
          const { data: relacionamentos, error: relError } = await supabase
            .from("local_servicos")
            .select("id_servicos")
            .eq("id_local", local.id);

          if (relError) throw relError;

          // Se o local tem serviços relacionados, busca os detalhes desses serviços
          if (relacionamentos && relacionamentos.length > 0) {
            const servicoIds = relacionamentos.map((rel) => rel.id_servicos);

            const { data: servicos, error: servicosError } = await supabase
              .from("servicos")
              .select("*")
              .in("id", servicoIds);

            if (servicosError) throw servicosError;

            // Retorna o local com seus serviços
            return {
              ...local,
              servicos: servicos || [],
            };
          }

          // Se não tem serviços, retorna o local com array vazio de serviços
          return {
            ...local,
            servicos: [],
          };
        })
      );

      return { data: locaisComServicos, error: null };
    } catch (error) {
      console.error("Erro ao buscar locais com serviços:", error);
      return { data: null, error };
    }
  }

  async getServicosPorLocalId(localId) {
    try {
      // Busca o local específico
      const { data: local, error: localError } = await supabase
        .from("local")
        .select("*")
        .eq("id", localId)
        .single();

      if (localError) throw localError;
      if (!local) throw new Error("Local não encontrado");

      // Busca os IDs dos serviços relacionados ao local
      const { data: relacionamentos, error: relError } = await supabase
        .from("local_servicos")
        .select("id_servicos")
        .eq("id_local", localId);

      if (relError) throw relError;

      // Se o local tem serviços relacionados, busca os detalhes desses serviços
      if (relacionamentos && relacionamentos.length > 0) {
        const servicoIds = relacionamentos.map((rel) => rel.id_servicos);

        const { data: servicos, error: servicosError } = await supabase
          .from("servicos")
          .select("*")
          .in("id", servicoIds);

        if (servicosError) throw servicosError;

        // Retorna o local com seus serviços
        return {
          data: {
            ...local,
            servicos: servicos || [],
          },
          error: null,
        };
      }

      // Se não tem serviços, retorna o local com array vazio de serviços
      return {
        data: {
          ...local,
          servicos: [],
        },
        error: null,
      };
    } catch (error) {
      console.error(`Erro ao buscar serviços do local ${localId}:`, error);
      return { data: null, error };
    }
  }
}

module.exports = new LocalServicosRepository();

