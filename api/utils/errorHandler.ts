/**
 * Utilitário para tratar erros do Firebase e outros erros técnicos,
 * convertendo-os em mensagens amigáveis para o usuário.
 */

export interface ErrorHandlerOptions {
  /** Contexto do erro para personalizar a mensagem */
  context?: string;
  /** Se deve fazer log do erro técnico no console */
  logError?: boolean;
}

/**
 * Converte erros técnicos em mensagens amigáveis para o usuário
 */
export function handleUserFriendlyError(
  error: unknown, 
  options: ErrorHandlerOptions = {}
): string {
  const { context = 'sistema', logError = true } = options;
  
  if (logError) {
    console.error(`Erro no ${context}:`, error);
  }
  
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();
    
    // Erros do Firebase
    if (errorMessage.includes('firebaseerror') ||
        errorMessage.includes('nested arrays') ||
        errorMessage.includes('setdoc() called with invalid data') ||
        errorMessage.includes('invalid data')) {
      return 'Erro temporário no sistema. Tente novamente em alguns instantes.';
    }
    
    // Erros de rede
    if (errorMessage.includes('network') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('connection') ||
        errorMessage.includes('timeout')) {
      return 'Problema de conexão. Verifique sua internet e tente novamente.';
    }
    
    // Erros de API
    if (errorMessage.includes('api') ||
        errorMessage.includes('failed to fetch') ||
        errorMessage.includes('500') ||
        errorMessage.includes('503')) {
      return 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
    }
    
    // Erros de autenticação
    if (errorMessage.includes('authentication') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('401')) {
      return 'Erro de autenticação. Faça login novamente.';
    }
    
    // Erros de permissão
    if (errorMessage.includes('permission') ||
        errorMessage.includes('forbidden') ||
        errorMessage.includes('403')) {
      return 'Você não tem permissão para realizar esta ação.';
    }
    
    // Se a mensagem já é amigável, retorna ela
    if (!errorMessage.includes('error') && 
        !errorMessage.includes('failed') && 
        error.message.length < 100) {
      return error.message;
    }
  }
  
  // Mensagem genérica para outros casos
  return `Erro ao carregar dados do ${context}. Tente novamente.`;
}

/**
 * Hook para tratamento de erros em componentes React
 */
export function useErrorHandler(context: string = 'aplicação') {
  return (error: unknown) => handleUserFriendlyError(error, { context });
}

/**
 * Wrapper para funções assíncronas que podem gerar erros
 */
export async function withErrorHandling<T>(
  asyncFn: () => Promise<T>,
  context: string = 'operação'
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await asyncFn();
    return { data };
  } catch (error) {
    const errorMessage = handleUserFriendlyError(error, { context });
    return { error: errorMessage };
  }
}