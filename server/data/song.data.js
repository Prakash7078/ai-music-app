const songs = [
  {
    id: 'midnight-city-lights',
    title: 'Midnight City Lights',
    artist: 'Aarya Nova',
    album: 'Neon Echoes',
    audioAssetKey: 'midnight-city-lights',
    durationMs: 205000,
    coverColor: '#17312A',
    accentColor: '#1ED760',
    description: 'A synth-pop night drive track used as our first demo song.',
    lyrics: [
      {
        id: 'm1',
        timestampMs: 0,
        original: 'Streetlights bloom when the skyline wakes',
        translations: {
          english: 'Streetlights bloom when the skyline wakes',
          hindi: 'जब शहर जागता है, सड़क की रोशनी खिल उठती है',
          telugu: 'నగరం మేల్కొన్నప్పుడు వీధి దీపాలు వికసిస్తాయి',
          spanish: 'Las luces de la calle florecen cuando despierta la ciudad',
        },
      },
      {
        id: 'm2',
        timestampMs: 18000,
        original: 'Your heartbeat moves with the subway brakes',
        translations: {
          english: 'Your heartbeat moves with the subway brakes',
          hindi: 'तुम्हारी धड़कन मेट्रो की रुकावटों के साथ चलती है',
          telugu: 'నీ గుండె చప్పుడు మెట్రో బ్రేక్‌ల సరితూగుతుంది',
          spanish: 'Tu latido se mueve con los frenos del metro',
        },
      },
      {
        id: 'm3',
        timestampMs: 43000,
        original: 'We paint our names in electric blue',
        translations: {
          english: 'We paint our names in electric blue',
          hindi: 'हम अपने नाम बिजली जैसे नीले रंग में लिखते हैं',
          telugu: 'మన పేర్లను ఎలక్ట్రిక్ నీలంలో రాస్తాము',
          spanish: 'Pintamos nuestros nombres en azul eléctrico',
        },
      },
    ],
  },
  {
    id: 'ocean-memory',
    title: 'Ocean Memory',
    artist: 'Luna Harbor',
    album: 'Blue Archive',
    audioAssetKey: 'ocean-memory',
    durationMs: 238000,
    coverColor: '#11283A',
    accentColor: '#5FD1FF',
    description: 'A mellow atmospheric track with spacious vocals and coastal imagery.',
    lyrics: [
      {
        id: 'o1',
        timestampMs: 0,
        original: 'Salt on the air and your voice in the tide',
        translations: {
          english: 'Salt on the air and your voice in the tide',
          hindi: 'हवा में नमक है और लहरों में तुम्हारी आवाज़',
          telugu: 'గాలిలో ఉప్పు వాసన, అలల్లో నీ స్వరం',
          spanish: 'Sal en el aire y tu voz en la marea',
        },
      },
      {
        id: 'o2',
        timestampMs: 21000,
        original: 'Every broken wave keeps you by my side',
        translations: {
          english: 'Every broken wave keeps you by my side',
          hindi: 'हर टूटती लहर तुम्हें मेरे पास रखती है',
          telugu: 'ప్రతి విరిగే అల నిన్ను నా పక్కనే ఉంచుతుంది',
          spanish: 'Cada ola rota te mantiene a mi lado',
        },
      },
      {
        id: 'o3',
        timestampMs: 52000,
        original: 'I hear your name in the seabirds cry',
        translations: {
          english: 'I hear your name in the seabirds cry',
          hindi: 'समुद्री पक्षियों की पुकार में मैं तुम्हारा नाम सुनता हूँ',
          telugu: 'సముద్ర పక్షుల కేకల్లో నీ పేరు వినిపిస్తుంది',
          spanish: 'Escucho tu nombre en el grito de las aves marinas',
        },
      },
    ],
  },
];

module.exports = { songs };
