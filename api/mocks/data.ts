
import { Ad, Favorite, Game, GameDetailData, News, Player, SearchResult, Setting, Standing, Team, User, Video } from '../types/types';

const generateItems = <T,>(count: number, factory: (index: number) => T): T[] => {
  return Array.from({ length: count }, (_, i) => factory(i + 1));
};

const teamsDb = [
    { name: 'Benfica', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9772_large.png' },
    { name: 'Celtic', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9925_large.png' },
    { name: 'Sporting CP', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9768_large.png' },
    { name: 'Real Madrid', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/Th4fAVAZeCJWRcKoLW7koA_96x96.png' },
    { name: 'Barcelona', logo: 'https://ssl.gstatic.com/onebox/media/sports/logos/paYnEE8hcrP96neHRNofhQ_96x96.png' },
    { name: 'Manchester City', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/8456_large.png' },
    { name: 'Liverpool', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/8650_large.png' },
    { name: 'Bayern Munich', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9823_large.png' },
    { name: 'PSG', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9847_large.png' },
    { name: 'Juventus', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9885_large.png' },
    { name: 'Inter Milan', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/8636_large.png' },
    { name: 'Monaco', logo: "https://images.fotmob.com/image_resources/logo/teamlogo/9829_large.png" },
    { name: 'Arsenal', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9825_large.png' },
    { name: 'Atletico Madrid', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9906_large.png' },
    { name: 'Aston Villa', logo: "https://images.fotmob.com/image_resources/logo/teamlogo/10252_large.png" },
    { name: 'Bologna', logo: 'https://images.fotmob.com/image_resources/logo/teamlogo/9857_large.png' },
];

export const mockGames: Game[] = generateItems(18, (i) => {
    const teamAIndex = (i - 1) % teamsDb.length;
    const teamBIndex = (i) % teamsDb.length;
    return {
        id: i,
        teamA: teamsDb[teamAIndex],
        teamB: teamsDb[teamBIndex],
        score: `${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 4)}`,
        minute: `${Math.floor(Math.random() * 90)}'`,
        status: i % 3 === 0 ? 'Terminado' : (i % 3 === 1 ? 'Ao vivo' : 'Agendado'),
        competition: i % 2 === 0 ? 'Primeira Liga' : 'Champions League',
        events: generateItems(Math.floor(Math.random() * 5), j => ({ minute: `${j * 15}'`, event: j % 2 === 0 ? 'Golo' : 'Cartão Amarelo', player: `Jogador ${j}`})),
        stats: { teamA: { possession: 60, shots: 15 }, teamB: { possession: 40, shots: 8 } },
        comments: generateItems(15, j => ({ id: j, user: `Fã ${j}`, text: `Grande jogo!`, minute: `${j*5}'` })),
    };
});

export const mockNews: News[] = generateItems(16, (i) => ({
    id: i,
    title: `Notícia de Última Hora Sobre o Jogo ${i}`,
    category: i % 2 === 0 ? 'Transferências' : 'Análise Tática',
    thumbnail: `https://picsum.photos/seed/${i + 100}/400/200`,
    date: `20/07/2024`,
    content: `Este é o corpo completo da notícia ${i}, detalhando os eventos mais recentes e as implicações para a equipa.`,
    images: [`https://picsum.photos/seed/${i + 200}/600/400`, `https://picsum.photos/seed/${i + 300}/600/400`],
    videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
    comments: generateItems(15, j => ({ id: j, user: `Leitor ${j}`, text: 'Excelente artigo!' })),
}));

const mockPlayers: Player[] = generateItems(18, (i) => ({
    id: i,
    name: `Jogador ${i}`,
    position: i % 4 === 0 ? 'Avançado' : i % 4 === 1 ? 'Médio' : i % 4 === 2 ? 'Defesa' : 'Guarda-redes',
    number: i,
    stats: { goals: Math.floor(Math.random() * 20), assists: Math.floor(Math.random() * 15), matches: 30 },
    transfers: [{ from: `Clube ${i-1}`, to: `Clube ${i}`, year: 2023 }],
}));

export const mockTeams: Team[] = generateItems(16, (i) => ({
    id: i,
    name: teamsDb[i - 1].name,
    logo: teamsDb[i-1].logo,
    competition: i % 3 === 0 ? 'La Liga' : i % 3 === 1 ? 'Premier League' : 'Primeira Liga',
    players: mockPlayers.slice(0, 18),
    recentMatches: mockGames.slice(0, 5).map(g => ({ id: g.id, teamA: g.teamA, teamB: g.teamB, score: g.score, status: g.status })),
}));

export const mockStandings: Standing[] = generateItems(20, (i) => ({
    position: i,
    team: teamsDb[(i - 1) % teamsDb.length],
    points: 90 - i * 2,
    played: 34,
    wins: 28 - i,
    draws: 6,
    losses: i,
    goalDifference: `+${40 - i}`,
}));

export const mockVideos: Video[] = generateItems(15, (i) => ({
    id: i,
    title: `Melhores Momentos: Jogo Épico ${i}`,
    thumbnail: `https://picsum.photos/seed/${i + 400}/400/225`,
    duration: `${Math.floor(Math.random() * 10)}:${Math.floor(Math.random() * 60).toString().padStart(2,'0')}`,
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
}));

export const mockUsers: User[] = generateItems(15, i => ({
    id: i,
    name: `User ${i}`,
    role: i === 1 ? 'Super Admin' : (i < 4 ? 'Admin' : 'User'),
    status: i % 5 === 0 ? 'Banned' : 'Active',
}));

export const mockAds: Ad[] = generateItems(15, i => ({
    id: i,
    type: i % 3 === 0 ? 'banner' : i % 3 === 1 ? 'video' : 'affiliate',
    name: `Anúncio Parceiro ${i}`,
    url: '#',
}));



export const mockFavorites: Favorite[] = generateItems(15, (i) => {
    const team = teamsDb[i - 1] || teamsDb[0];
    return {
        id: i,
        type: 'team',
        name: team.name,
        logo: team.logo,
    };
});

export const mockSettings: Setting[] = [
    { id: 'goalNotifications', label: 'Notificações de Gols', enabled: true },
    { id: 'matchStart', label: 'Início da Partida', enabled: true },
    { id: 'halfTime', label: 'Fim do 1º Tempo', enabled: false },
    { id: 'matchEnd', label: 'Fim da Partida', enabled: true },
    { id: 'redCards', label: 'Cartões Vermelhos', enabled: true },
    { id: 'lineups', label: 'Escalações Confirmadas', enabled: true },
    { id: 'transferNews', label: 'Notícias de Transferências', enabled: false },
    { id: 'teamNews', label: 'Notícias da Minha Equipa', enabled: true },
    { id: 'videoHighlights', label: 'Vídeos de Melhores Momentos', enabled: true },
    { id: 'liveTicker', label: 'Notificações de Jogo Ao-Vivo', enabled: false },
    { id: 'pressConference', label: 'Alertas de Conferência de Imprensa', enabled: false },
    { id: 'injuryReports', label: 'Relatórios de Lesões', enabled: true },
    { id: 'weeklySummary', label: 'Resumo Semanal', enabled: false },
    { id: 'podcastAlerts', label: 'Alertas de Novos Podcasts', enabled: false },
    { id: 'bettingOdds', label: 'Notificações de Odds', enabled: false },
];


export const mockCompetitions: string[] = [
    'Primeira Liga', 'Champions League', 'La Liga', 'Premier League', 'Serie A', 'Bundesliga', 'Ligue 1', 'Brasileirão', 'Copa Libertadores', 'FA Cup', 'Copa do Rei', 'DFB-Pokal', 'Taça de Portugal', 'MLS', 'Superliga Argentina'
];

export const mockSearchSuggestions: string[] = [
    'Real Madrid', 'Benfica', 'Cristiano Ronaldo', 'Notícias de transferências', 'Jogos de hoje', 'FC Porto', 'Liverpool', 'Champions League final', 'Resultados ao vivo', 'Mbappé', 'Melhores momentos', 'Classificação Premier League', 'Sporting CP', 'Messi', 'Chelsea vs Arsenal'
];

const gameResults: SearchResult[] = mockGames.slice(0, 4).map(g => ({ id: `game-${g.id}`, type: 'game', data: g }));
const newsResults: SearchResult[] = mockNews.slice(0, 4).map(n => ({ id: `news-${n.id}`, type: 'news', data: n }));
const teamResults: SearchResult[] = mockTeams.slice(0, 4).map(t => ({ id: `team-${t.id}`, type: 'team', data: t }));
const playerResults: SearchResult[] = mockPlayers.slice(0, 5).map(p => ({ id: `player-${p.id}`, type: 'player', data: p }));

export const mockSearchResults: SearchResult[] = [...gameResults, ...newsResults, ...teamResults, ...playerResults]
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);






    
export const mockGameDetailData: GameDetailData = {
    "home": {
        "formation": "4-4-2", "confirmed_formation": 1, "coach": { "id": 519, "name": "Prelec, Ivan" },
        "squad": [
            { "player": { "id": "3355", "name": "Vekic, Igor", "common_name": "Vekic, Igor", "firstname": "Igor", "lastname": "Vekic", "weight": "0", "height": "0", "img": "https://cdn.soccersapi.com/images/soccer/players/50/3355.png", "country": { "id": "109", "name": "Slovenia", "cc": "si" } }, "number": "1", "captain": null, "position": "G", "position_name": "Goalkeeper", "order": 1 },
            { "player": { "id": "22398", "name": "Nielsen, Lasse", "common_name": "Nielsen, Lasse", "firstname": "Lasse Ladegaard", "lastname": "Nielsen", "weight": "74", "height": "185", "img": "https://cdn.soccersapi.com/images/soccer/players/50/22398.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "4", "captain": null, "position": "D", "position_name": "Right Back", "order": 2 },
            { "player": { "id": "19492822", "name": "Kolinger, Denis", "common_name": "Kolinger, D.", "firstname": "Denis", "lastname": "Kolinger", "weight": null, "height": null, "img": "https://cdn.soccersapi.com/images/soccer/players/50/19492822.png", "country": { "id": null, "name": null, "cc": null } }, "number": "32", "captain": null, "position": "D", "position_name": "Central Defender", "order": 3 },
            { "player": { "id": "37985", "name": "Vestergard, Mike", "common_name": "Vestergard, Mike", "firstname": "Mike", "lastname": "Vestergard", "weight": "0", "height": "0", "img": "https://cdn.soccersapi.com/images/soccer/players/50/37985.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "6", "captain": null, "position": "D", "position_name": "Central Defender", "order": 4 },
            { "player": { "id": "14724", "name": "Sorensen, Christian", "common_name": "Sorensen, Christian", "firstname": "Christian Nikolaj", "lastname": "Sorensen", "weight": "73", "height": "179", "img": "https://cdn.soccersapi.com/images/soccer/players/50/14724.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "3", "captain": null, "position": "D", "position_name": "Left Back", "order": 5 },
            { "player": { "id": "37501", "name": "Gundelund, Thomas", "common_name": "Gundelund, Thomas", "firstname": "Thomas", "lastname": "Gundelund", "weight": "0", "height": "180", "img": "https://cdn.soccersapi.com/images/soccer/players/50/37501.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "2", "captain": null, "position": "M", "position_name": "Right Winger", "order": 6 },
            { "player": { "id": "651692511", "name": "Grondal, Christian", "common_name": "Grondal, Christian", "firstname": "Christian", "lastname": "Grondal", "weight": null, "height": null, "img": "https://cdn.soccersapi.com/images/soccer/players/50/651692511.png", "country": { "id": null, "name": null, "cc": null } }, "number": "7", "captain": null, "position": "M", "position_name": "Central Midfielder", "order": 7 },
            { "player": { "id": "1126876829", "name": "Lauritsen, Tobias", "common_name": "Lauritsen, Tobias", "firstname": "Tobias", "lastname": "Lauritsen", "weight": null, "height": null, "img": "https://cdn.soccersapi.com/images/soccer/players/50/1126876829.png", "country": { "id": null, "name": null, "cc": null } }, "number": "8", "captain": null, "position": "M", "position_name": "Central Midfielder", "order": 8 },
            { "player": { "id": "5603", "name": "Duelund, Mikkel", "common_name": "Duelund, Mikkel", "firstname": "Mikkel", "lastname": "Duelund Poulsen", "weight": "70", "height": "178", "img": "https://cdn.soccersapi.com/images/soccer/players/50/5603.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "10", "captain": null, "position": "M", "position_name": "Left Winger", "order": 9 },
            { "player": { "id": "13602", "name": "Hjulsager, Andrew", "common_name": "Hjulsager, Andrew", "firstname": "Andrew Frederik", "lastname": "Hjulsager", "weight": "71", "height": "175", "img": "https://cdn.soccersapi.com/images/soccer/players/50/13602.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "17", "captain": null, "position": "F", "position_name": "Forward", "order": 10 },
            { "player": { "id": "17052", "name": "Velkov, Stefan", "common_name": "Velkov, Stefan", "firstname": "Stefan", "lastname": "Velkov", "weight": "0", "height": "190", "img": "https://cdn.soccersapi.com/images/soccer/players/50/17052.png", "country": { "id": "26", "name": "Bulgaria", "cc": "bg" } }, "number": "13", "captain": null, "position": "F", "position_name": "Forward", "order": 11 }
        ]
    },
    "away": {
        "formation": "4-4-2", "confirmed_formation": 1, "coach": { "id": 9428, "name": "Bertelsen, Rasmus" },
        "squad": [
            { "player": { "id": "37545", "name": "Storch, Jannich", "common_name": "Storch, Jannich", "firstname": "Jannich", "lastname": "Storch", "weight": "0", "height": "189", "img": "https://cdn.soccersapi.com/images/soccer/players/50/37545.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "32", "captain": null, "position": "G", "position_name": "Goalkeeper", "order": 1 },
            { "player": { "id": "1885", "name": "Greve Petersen, Mathias", "common_name": "Greve Petersen, Mathias", "firstname": "Mathias", "lastname": "Greve Petersen", "weight": "77", "height": "188", "img": "https://cdn.soccersapi.com/images/soccer/players/50/1885.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "17", "captain": null, "position": "D", "position_name": "Right Back", "order": 2 },
            { "player": { "id": "38444", "name": "Dyhr, Nikolas", "common_name": "Dyhr, Nikolas", "firstname": "Nikolas", "lastname": "Dyhr", "weight": "58", "height": "179", "img": "https://cdn.soccersapi.com/images/soccer/players/50/38444.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "44", "captain": null, "position": "D", "position_name": "Central Defender", "order": 3 },
            { "player": { "id": "1874", "name": "Romer, Andre", "common_name": "Romer, Andre", "firstname": "Andre", "lastname": "Romer", "weight": "74", "height": "186", "img": "https://cdn.soccersapi.com/images/soccer/players/50/1874.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "28", "captain": null, "position": "D", "position_name": "Central Defender", "order": 4 },
            { "player": { "id": "13815", "name": "Hoegh, Daniel", "common_name": "Hoegh, Daniel", "firstname": "Daniel Mathias", "lastname": "Hoegh", "weight": "79", "height": "190", "img": "https://cdn.soccersapi.com/images/soccer/players/50/13815.png", "country": { "id": "37", "name": "Denmark", "cc": "dk" } }, "number": "3", "captain": null, "position": "D", "position_name": "Left Back", "order": 5 },
            { "player": { "id": "10304", "name": "Dammers, Wessel", "common_name": "Dammers, Wessel", "firstname": "Wessel", "lastname": "Dammers", "weight": "68", "height": "185", "img": "https://cdn.soccersapi.com/images/soccer/players/50/10304.png", "country": { "id": "81", "name": "Netherlands", "cc": "nl" } }, "number": "4", "captain": null, "position": "M", "position_name": "Right Winger", "order": 6 },
            { "player": { "id": "5025293", "name": "Themsen, Mike", "common_name": "Themsen, Mike", "firstname": "Mike", "lastname": "Themsen", "weight": null, "height": null, "img": "https://cdn.soccersapi.com/images/soccer/players/50/5025293.png", "country": { "id": null, "name": null, "cc": null } }, "number": "30", "captain": null, "position": "M", "position_name": "Central Midfielder", "order": 7 },
            { "player": { "id": "21901", "name": "Bjorkengren, John", "common_name": "Bjorkengren, John", "firstname": "John", "lastname": "Bjorkengren", "weight": "78", "height": "180", "img": "https://cdn.soccersapi.com/images/soccer/players/50/21901.png", "country": { "id": "112", "name": "Sweden", "cc": "se" } }, "number": "6", "captain": null, "position": "M", "position_name": "Central Midfielder", "order": 8 },
            { "player": { "id": "257184", "name": "Mahmoud, Elies", "common_name": "Mahmoud, Elies", "firstname": "Elies", "lastname": "Mahmoud", "weight": null, "height": null, "img": "https://cdn.soccersapi.com/images/soccer/players/50/257184.png", "country": { "id": null, "name": null, "cc": null } }, "number": "11", "captain": null, "position": "M", "position_name": "Left Winger", "order": 9 },
            { "player": { "id": "6184", "name": "Toure, Mohamed", "common_name": "Toure, Mohamed", "firstname": "Mohamed", "lastname": "Toure", "weight": "0", "height": "0", "img": "https://cdn.soccersapi.com/images/soccer/players/50/6184.png", "country": { "id": "14", "name": "Australia", "cc": "au" } }, "number": "7", "captain": null, "position": "F", "position_name": "Forward", "order": 10 },
            { "player": { "id": "1553202275", "name": "Hansen, Sabil", "common_name": "Hansen, Sabil", "firstname": "Sabil", "lastname": "Hansen", "weight": null, "height": null, "img": "https://cdn.soccersapi.com/images/soccer/players/50/1553202275.png", "country": { "id": null, "name": null, "cc": null } }, "number": "24", "captain": null, "position": "F", "position_name": "Forward", "order": 11 }
        ]
    }
};

mockGames.unshift({
    id: 999,
    teamA: { name: 'Vejle', logo: 'https://cdn.soccersapi.com/images/soccer/teams/100/2288.png' },
    teamB: { name: 'Randers FC', logo: 'https://cdn.soccersapi.com/images/soccer/teams/100/2275.png' },
    score: '1-2',
    status: 'Terminado',
    competition: 'Superliga',
    lineups: mockGameDetailData,
    events: [
        { minute: "23'", event: 'Golo', player: 'M. Duelund' },
        { minute: "45'", event: 'Cartão Amarelo', player: 'A. Romer' },
        { minute: "67'", event: 'Golo', player: 'M. Toure' },
        { minute: "89'", event: 'Golo', player: 'S. Hansen' },
    ],
    stats: {
        teamA: { possession: 54, shots: 12 },
        teamB: { possession: 46, shots: 9 },
    },
    comments: generateItems(10, j => ({ id: j, user: `Comentador ${j}`, text: `Análise do lance...`, minute: `${j*9}'` }))
} as Game);
