import { renderConfirmationPage } from './html.utils.js';

describe('html.utils.js', () => {
  describe('renderConfirmationPage', () => {
    it('deve renderizar a página de sucesso com a cor de destaque padrão', () => {
      const html = renderConfirmationPage({ title: 'Agendamento confirmado!', message: 'Tudo certo!' });

      expect(html).toContain('Agendamento confirmado!');
      expect(html).toContain('Tudo certo!');
      expect(html).toContain('#3370EB');
    });

    it('deve renderizar a página de erro com a cor de destaque de falha', () => {
      const html = renderConfirmationPage({
        title: 'Não foi possível confirmar',
        message: 'Agendamento não encontrado',
        isError: true
      });

      expect(html).toContain('Não foi possível confirmar');
      expect(html).toContain('Agendamento não encontrado');
      expect(html).toContain('#D64545');
    });
  });
});
