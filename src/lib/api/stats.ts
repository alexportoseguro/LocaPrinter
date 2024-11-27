import { StatsService } from '../statsService';

export async function getCompanyStats(req: Request) {
  try {
    const url = new URL(req.url);
    const companyId = url.pathname.split('/').pop();

    if (!companyId) {
      return new Response('Company ID não fornecido', { status: 400 });
    }

    const statsService = StatsService.getInstance();
    const stats = await statsService.getStats(companyId);

    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'private, max-age=300' // 5 minutos
      }
    });
  } catch (error) {
    console.error('Erro ao processar requisição de estatísticas:', error);
    return new Response('Erro interno do servidor', { status: 500 });
  }
}
