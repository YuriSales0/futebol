-- =============================================
-- GIE PLATFORM - SEED DATA PARA DEMONSTRAÇÃO
-- =============================================
-- Rode este SQL depois de criar usuários no Auth.
-- Os jogadores abaixo usam UUIDs fictícios de auth.
-- Em produção, os registros são criados pelo signup.

-- NOTA: Para usar este seed, primeiro crie usuários no
-- Supabase Auth > Users > Add User para cada jogador,
-- depois substitua os UUIDs abaixo pelos reais.

-- =============================================
-- Se quiser popular sem auth, rode isso primeiro:
-- (desabilita temporariamente a FK pra auth.users)
-- =============================================

-- Jogadores de demonstração (dados fictícios)
-- Descomente e ajuste se quiser inserir diretamente

/*
INSERT INTO players (auth_user_id, full_name, nickname, date_of_birth, position, city, state, region, height_cm, preferred_foot, current_club, bio) VALUES
  (gen_random_uuid(), 'Lucas Silva Santos', 'Lukinha', '2010-03-15', 'meia', 'Recife', 'PE', 'nordeste', 165, 'esquerdo', 'Escolinha Bola de Ouro', 'Meia criativo do Recife. Sonho jogar na Europa.'),
  (gen_random_uuid(), 'Pedro Henrique Oliveira', 'Pedrinho', '2011-07-22', 'ponta_direita', 'Salvador', 'BA', 'nordeste', 158, 'direito', 'CT Bahia Kids', 'Velocista nato. Rápido com e sem bola.'),
  (gen_random_uuid(), 'Rafael Costa Souza', 'Rafa', '2009-11-03', 'volante', 'Manaus', 'AM', 'norte', 172, 'direito', 'Escolinha Amazônia FC', 'Volante técnico. Gosto de construir desde trás.'),
  (gen_random_uuid(), 'Gabriel Nascimento Lima', 'Biel', '2010-01-18', 'centroavante', 'Fortaleza', 'CE', 'nordeste', 175, 'ambos', 'Fortaleza Base', 'Artilheiro. 23 gols na última temporada sub-15.'),
  (gen_random_uuid(), 'Matheus Santos Ferreira', 'Matheuzinho', '2012-05-09', 'lateral_esquerdo', 'São Luís', 'MA', 'nordeste', 160, 'esquerdo', NULL, 'Lateral ofensivo. Cruzo bem com a esquerda.'),
  (gen_random_uuid(), 'João Victor Rodrigues', 'JV', '2010-08-30', 'zagueiro', 'Belém', 'PA', 'norte', 178, 'direito', 'Remo Sub-15', 'Zagueiro líder. Capitão do time da escolinha.'),
  (gen_random_uuid(), 'Davi Almeida Martins', 'Davizinho', '2011-04-14', 'ponta_esquerda', 'Teresina', 'PI', 'nordeste', 162, 'esquerdo', NULL, 'Ponta driblador. Me inspiro no Neymar.'),
  (gen_random_uuid(), 'Arthur Barbosa Reis', 'Arthurzão', '2009-12-25', 'goleiro', 'Natal', 'RN', 'nordeste', 180, 'direito', 'América-RN Base', 'Goleiro alto. Boa envergadura e reflexo.'),
  (gen_random_uuid(), 'Enzo Gabriel Costa', 'Enzinho', '2012-02-11', 'meia', 'Aracaju', 'SE', 'nordeste', 155, 'direito', 'Escolinha Sergipe FC', 'Meia armador. Gosto de dar assistência.'),
  (gen_random_uuid(), 'Kaique Santos Silva', 'KK', '2010-09-07', 'volante', 'Porto Velho', 'RO', 'norte', 168, 'direito', NULL, 'Volante raçudo. Não deixo passar ninguém.'),
  (gen_random_uuid(), 'Bryan Souza Pereira', 'Bryan', '2011-06-20', 'centroavante', 'Cuiabá', 'MT', 'centro_oeste', 170, 'direito', 'Cuiabá Base', 'Centroavante matador. Bom no jogo aéreo.'),
  (gen_random_uuid(), 'Nicolas Ferreira Gomes', 'Nick', '2010-10-15', 'ponta_direita', 'Macapá', 'AP', 'norte', 163, 'ambos', NULL, 'Ponta veloz. Gosto de partir pro gol.');
*/

-- =============================================
-- GIE Scores de exemplo (usar com jogadores existentes)
-- =============================================
-- Depois de ter jogadores no banco, rode queries como:
--
-- UPDATE gie_scores SET
--   d1_scanning = 7.5, d2_decision = 8.0, d3_off_ball = 6.5,
--   d4_orientation = 7.0, d5_anticipation = 6.0,
--   d6_resilience = 8.5, d7_communication = 7.0
-- WHERE player_id = '<UUID_DO_JOGADOR>';
--
-- UPDATE confidence_scores SET
--   video_source_score = 0.3, recency_score = 0.8,
--   sample_size_score = 0.2, consistency_score = 0.5
-- WHERE player_id = '<UUID_DO_JOGADOR>';

SELECT 'Seed file loaded. Descomente os INSERTs para popular com dados de demonstração.' AS status;
