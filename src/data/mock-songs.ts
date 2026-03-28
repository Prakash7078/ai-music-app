import { Song } from '@/types/music';

export const mockSongs: Song[] = [
  {
    id: 'midnight-city-lights',
    title: 'Midnight City Lights',
    artist: 'Aarya Nova',
    album: 'Neon Echoes',
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
      {
        id: 'm4',
        timestampMs: 69000,
        original: 'Every passing train keeps pulling me to you',
        translations: {
          english: 'Every passing train keeps pulling me to you',
          hindi: 'हर गुजरती ट्रेन मुझे तुम्हारी ओर खींचती रहती है',
          telugu: 'ప్రతి దూసుకెళ్తున్న రైలు నన్ను నీ వైపు లాగుతుంది',
          spanish: 'Cada tren que pasa me sigue llevando hacia ti',
        },
      },
      {
        id: 'm5',
        timestampMs: 98000,
        original: 'City lights, stay with me tonight',
        translations: {
          english: 'City lights, stay with me tonight',
          hindi: 'ओ शहर की रोशनी, आज रात मेरे साथ रहो',
          telugu: 'నగర దీపాలా, ఈ రాత్రి నాతోనే ఉండు',
          spanish: 'Luces de la ciudad, quédate conmigo esta noche',
        },
      },
      {
        id: 'm6',
        timestampMs: 131000,
        original: 'Turn this silence into satellite sound',
        translations: {
          english: 'Turn this silence into satellite sound',
          hindi: 'इस ख़ामोशी को सैटेलाइट की ध्वनि में बदल दो',
          telugu: 'ఈ నిశ్శబ్దాన్ని ఉపగ్రహ ధ్వనిగా మార్చు',
          spanish: 'Convierte este silencio en sonido satelital',
        },
      },
      {
        id: 'm7',
        timestampMs: 166000,
        original: 'When the chorus lands, our world spins around',
        translations: {
          english: 'When the chorus lands, our world spins around',
          hindi: 'जब मुखड़ा आता है, हमारी दुनिया घूमने लगती है',
          telugu: 'పల్లవి మొదలైతే మన లోకం తిరుగుతుంది',
          spanish: 'Cuando llega el coro, nuestro mundo gira',
        },
      },
    ],
  },
  {
    id: 'ocean-memory',
    title: 'Ocean Memory',
    artist: 'Luna Harbor',
    album: 'Blue Archive',
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
      {
        id: 'o4',
        timestampMs: 96000,
        original: 'Blue horizon, teach my hands to fly',
        translations: {
          english: 'Blue horizon, teach my hands to fly',
          hindi: 'नीले क्षितिज, मेरे हाथों को उड़ना सिखाओ',
          telugu: 'నీలి దిక్సూచి, నా చేతులకు ఎగరడం నేర్పు',
          spanish: 'Horizonte azul, enséñales a mis manos a volar',
        },
      },
      {
        id: 'o5',
        timestampMs: 141000,
        original: 'Ocean memory, never let me drift too far',
        translations: {
          english: 'Ocean memory, never let me drift too far',
          hindi: 'समुद्र की याद, मुझे बहुत दूर बहने मत देना',
          telugu: 'సముద్ర జ్ఞాపకం, నన్ను చాలా దూరం ఒయలనీయం',
          spanish: 'Memoria del océano, no me dejes alejarme demasiado',
        },
      },
      {
        id: 'o6',
        timestampMs: 188000,
        original: 'Keep me anchored where your echoes are',
        translations: {
          english: 'Keep me anchored where your echoes are',
          hindi: 'मुझे वहीं थामे रखो जहाँ तुम्हारी गूँज है',
          telugu: 'నీ ప్రతిధ్వనులు ఉన్న చోట నన్ను నిలిపి ఉంచు',
          spanish: 'Mantenme anclado donde están tus ecos',
        },
      },
    ],
  },
];
