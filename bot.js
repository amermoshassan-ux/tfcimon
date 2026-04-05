// TFCImon Discord Bot
// Run: npm install discord.js && node bot.js

const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const CLIENT_ID = process.env.CLIENT_ID || 'YOUR_CLIENT_ID_HERE';

// ─── CARD DATA ─────────────────────────────────────────────────────────────────

const CARDS = {
  celestia: {
    id: 'celestia', name: 'Celestia', hp: 200, type: 'Dark', rarity: 'Rare', emoji: '🌑', color: 0x2c2c54,
    description: 'A dark warrior with flower-like wings and heavy armor.',
    moves: [
      { name: '#Goon', damage: 75, cost: 2, emoji: '👊' },
      { name: 'Drawing w/ Downfall', damage: 150, cost: 4, emoji: '🌀' },
    ],
  },
  flame: {
    id: 'flame', name: 'Flame', hp: 200, type: 'Fire', rarity: 'Rare', emoji: '🔥', color: 0xe84545,
    description: 'Type: Fire | #1 CEO | A plaid-shirted cat with a sailor cap.',
    moves: [
      { name: 'Timeout', damage: 50, cost: 2, emoji: '⏱️' },
      { name: 'Kick', damage: 100, cost: 3, emoji: '🦵' },
      { name: 'Ban', damage: 250, cost: 6, emoji: '🔨' },
    ],
  },
  isy: {
    id: 'isy', name: 'Isy EX', hp: 150, type: 'Normal', rarity: 'EX', emoji: '🍌', color: 0x3498db,
    description: 'Type: Normal | T★2 | Member MECT — EX card!',
    moves: [
      { name: 'Banana', damage: 50, cost: 2, emoji: '🍌' },
      { name: 'Summon-SPK', damage: 100, cost: 4, emoji: '📢' },
      { name: 'EX POWER: Summon Banana Kingdom', damage: 180, cost: 6, emoji: '👑', isEx: true },
    ],
  },
  michael: {
    id: 'michael', name: 'Michael the Keeper', hp: 300, type: 'Shadow', rarity: 'LEGENDARY', emoji: '👁️', color: 0x1a1a2e,
    description: '⚠️ LEGENDARY — The rarest card in existence. Nobody knows where he came from.',
    moves: [
      { name: 'Hiding in Not Plain Sight', damage: 100, cost: 3, emoji: '🌫️' },
      { name: 'Server Hopper 3000', damage: 130, cost: 4, emoji: '🚀' },
    ],
  },
  spk_iii: {
    id: 'spk_iii', name: 'SPK_III', hp: 180, type: 'Normal', rarity: 'Uncommon', emoji: '🔊', color: 0xf39c12,
    description: 'A powerful speaker with banana energy and tough resolve.',
    moves: [
      { name: 'Banan', damage: 75, cost: 2, emoji: '🍌' },
      { name: 'Tuff Stuff', damage: 170, cost: 5, emoji: '💪' },
    ],
  },
};

const PACK_WEIGHTS = {
  celestia: 30, flame: 30, isy: 25, spk_iii: 14, michael: 1,
};

// ─── ARENA DATA ────────────────────────────────────────────────────────────────

const ARENAS = {
  '100_player_island': {
    id: '100_player_island',
    name: '100 Player Island',
    emoji: '🏝️',
    color: 0x00b894,
    description: 'Only one survives. The island swallows the rest.',
    holder: null, // userId of current champion
    holderName: null,
    guardian: {
      name: 'THE LAST ONE',
      emoji: '💀',
      hp: 350,
      energy: 4,
      moves: [
        { name: 'Island Wipe', damage: 90, cost: 2, emoji: '🌊' },
        { name: 'Final Circle', damage: 160, cost: 4, emoji: '🔴' },
        { name: 'Only Survivor', damage: 240, cost: 6, emoji: '☠️' },
      ],
    },
  },
  mingle: {
    id: 'mingle',
    name: 'Mingle',
    emoji: '💞',
    color: 0xff6b9d,
    description: 'The arena where friendships are made... and destroyed.',
    holder: null,
    holderName: null,
    guardian: {
      name: 'CUPID REAPER',
      emoji: '💘',
      hp: 280,
      energy: 3,
      moves: [
        { name: 'Heartbreak Strike', damage: 80, cost: 2, emoji: '💔' },
        { name: 'Toxic Charm', damage: 130, cost: 3, emoji: '🩷' },
        { name: 'Lovebomb', damage: 200, cost: 5, emoji: '💣' },
      ],
    },
  },
  rlgl: {
    id: 'rlgl',
    name: 'RLGL',
    emoji: '🚦',
    color: 0xe74c3c,
    description: 'Red Light. Green Light. One wrong move and you\'re gone.',
    holder: null,
    holderName: null,
    guardian: {
      name: 'THE DOLL',
      emoji: '🎎',
      hp: 320,
      energy: 3,
      moves: [
        { name: 'Red Light', damage: 0, cost: 1, emoji: '🔴', stun: true },
        { name: 'Green Light Rush', damage: 120, cost: 3, emoji: '🟢' },
        { name: 'Elimination', damage: 220, cost: 5, emoji: '🎯' },
      ],
    },
  },
  jumprope: {
    id: 'jumprope',
    name: 'Jumprope',
    emoji: '🪢',
    color: 0x6c5ce7,
    description: 'The rope never stops. Neither does the pain.',
    holder: null,
    holderName: null,
    guardian: {
      name: 'ROPEGOD',
      emoji: '🌀',
      hp: 260,
      energy: 3,
      moves: [
        { name: 'Whiplash', damage: 70, cost: 2, emoji: '💫' },
        { name: 'Double Dutch', damage: 140, cost: 3, emoji: '🌀' },
        { name: 'Infinite Loop', damage: 190, cost: 5, emoji: '♾️' },
      ],
    },
  },
  spinner: {
    id: 'spinner',
    name: 'Spinner',
    emoji: '🌪️',
    color: 0xfdcb6e,
    description: 'Spin the wheel. Face what it lands on.',
    holder: null,
    holderName: null,
    guardian: {
      name: 'VORTEX',
      emoji: '🌪️',
      hp: 290,
      energy: 3,
      moves: [
        { name: 'Dizzy Slam', damage: 85, cost: 2, emoji: '😵' },
        { name: 'Tornado Fist', damage: 150, cost: 4, emoji: '🌪️' },
        { name: 'Chaos Spin', damage: 210, cost: 6, emoji: '💥' },
      ],
    },
  },
  red_vs_blue: {
    id: 'red_vs_blue',
    name: 'Red vs Blue Island',
    emoji: '⚔️',
    color: 0xd63031,
    description: 'Pick a side. There is no neutral here.',
    holder: null,
    holderName: null,
    guardian: {
      name: 'COMMANDER NULL',
      emoji: '🎖️',
      hp: 330,
      energy: 4,
      moves: [
        { name: 'Blue Barrage', damage: 95, cost: 2, emoji: '🔵' },
        { name: 'Red Rush', damage: 145, cost: 3, emoji: '🔴' },
        { name: 'Total War', damage: 230, cost: 6, emoji: '💣' },
      ],
    },
  },
  pick_a_side: {
    id: 'pick_a_side',
    name: 'Pick a Side',
    emoji: '🪙',
    color: 0x2d3436,
    description: 'Every choice has a consequence. Choose wisely.',
    holder: null,
    holderName: null,
    guardian: {
      name: 'THE DECIDER',
      emoji: '⚖️',
      hp: 310,
      energy: 3,
      moves: [
        { name: 'Coin Flip Crush', damage: 75, cost: 2, emoji: '🪙' },
        { name: 'Wrong Choice', damage: 140, cost: 3, emoji: '❌' },
        { name: 'Judgement Day', damage: 250, cost: 6, emoji: '⚖️' },
      ],
    },
  },
};

// ─── IN-MEMORY STORAGE ────────────────────────────────────────────────────────

const playerData = new Map();
const activeBattles = new Map();
const activeArenaBattles = new Map();

function getPlayer(userId) {
  if (!playerData.has(userId)) {
    playerData.set(userId, { deck: [], energy: 3, nicknames: {} });
  }
  return playerData.get(userId);
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function weightedRandom(weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (const [id, weight] of Object.entries(weights)) {
    rand -= weight;
    if (rand <= 0) return id;
  }
  return Object.keys(weights)[0];
}

function openPack(count = 3) {
  const pulled = [];
  for (let i = 0; i < count; i++) pulled.push(weightedRandom(PACK_WEIGHTS));
  return pulled;
}

function hpBar(hp, maxHp) {
  const filled = Math.round((hp / maxHp) * 10);
  return '█'.repeat(Math.max(0, filled)) + '░'.repeat(Math.max(0, 10 - filled)) + ` ${hp}/${maxHp}`;
}

// Smart AI: picks the highest damage move it can afford
function aiPickMove(guardian, energy) {
  const affordable = guardian.moves.filter(m => m.cost <= energy && !m.stun);
  if (affordable.length === 0) {
    // Just use cheapest move
    return guardian.moves.reduce((a, b) => a.cost < b.cost ? a : b);
  }
  return affordable.reduce((best, m) => m.damage > best.damage ? m : best);
}

function buildDeckEmbed(userId, player) {
  const embed = new EmbedBuilder()
    .setTitle('📦 Your TFCImon Deck')
    .setColor(0x9b59b6)
    .setFooter({ text: `Player ID: ${userId}` });

  if (player.deck.length === 0) {
    embed.setDescription('Your deck is empty! Use `/openpack` to get cards.');
    return embed;
  }

  const counts = {};
  for (const id of player.deck) counts[id] = (counts[id] || 0) + 1;

  const lines = Object.entries(counts).map(([id, count]) => {
    const card = CARDS[id];
    const nickname = player.nicknames && player.nicknames[id] ? ` *"${player.nicknames[id]}"*` : '';
    return `${card.emoji} **${card.name}**${nickname} ×${count} — ${card.hp}HP | ${card.type}`;
  });

  embed.setDescription(lines.join('\n'));
  embed.addFields({ name: '🃏 Total Cards', value: `${player.deck.length}`, inline: true });
  return embed;
}

// ─── SLASH COMMANDS ────────────────────────────────────────────────────────────

const commands = [
  new SlashCommandBuilder()
    .setName('openpack')
    .setDescription('Open a TFCImon pack and get 3 random cards!')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('deck')
    .setDescription('View your TFCImon card deck')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('battle')
    .setDescription('Challenge another member to a TFCImon battle!')
    .addUserOption(opt =>
      opt.setName('opponent').setDescription('The member you want to battle').setRequired(true)
    ).toJSON(),

  new SlashCommandBuilder()
    .setName('name')
    .setDescription('Give a nickname to a TFCImon card in your deck!')
    .addStringOption(opt =>
      opt.setName('card').setDescription('Which card to rename').setRequired(true)
        .addChoices(
          { name: 'Celestia', value: 'celestia' },
          { name: 'Flame', value: 'flame' },
          { name: 'Isy EX', value: 'isy' },
          { name: 'SPK_III', value: 'spk_iii' },
          { name: 'Michael the Keeper', value: 'michael' },
        )
    )
    .addStringOption(opt =>
      opt.setName('nickname').setDescription('The nickname you want to give your card').setRequired(true).setMaxLength(32)
    ).toJSON(),

  new SlashCommandBuilder()
    .setName('arenas')
    .setDescription('View all TFCImon arenas and their current holders!')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('challenge')
    .setDescription('Challenge an arena guardian to claim it!')
    .addStringOption(opt =>
      opt.setName('arena').setDescription('Which arena to challenge').setRequired(true)
        .addChoices(
          { name: '🏝️ 100 Player Island', value: '100_player_island' },
          { name: '💞 Mingle', value: 'mingle' },
          { name: '🚦 RLGL', value: 'rlgl' },
          { name: '🪢 Jumprope', value: 'jumprope' },
          { name: '🌪️ Spinner', value: 'spinner' },
          { name: '⚔️ Red vs Blue Island', value: 'red_vs_blue' },
          { name: '🪙 Pick a Side', value: 'pick_a_side' },
        )
    ).toJSON(),
];

// ─── REGISTER ─────────────────────────────────────────────────────────────────

async function registerCommands() {
  const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);
  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Slash commands registered!');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

// ─── CLIENT ───────────────────────────────────────────────────────────────────

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ TFCImon bot is online as ${client.user.tag}!`);
  client.user.setActivity('TFCImon — /openpack to start!');
});

// ─── INTERACTIONS ─────────────────────────────────────────────────────────────

client.on('interactionCreate', async (interaction) => {

  // ── /openpack ──
  if (interaction.isChatInputCommand() && interaction.commandName === 'openpack') {
    await interaction.deferReply();
    const userId = interaction.user.id;
    const player = getPlayer(userId);
    const pulled = openPack(3);
    for (const cardId of pulled) player.deck.push(cardId);

    const embed = new EmbedBuilder()
      .setTitle('📦 Pack Opened!')
      .setDescription(`${interaction.user.displayName} tore open a TFCImon pack...`)
      .setColor(0xf39c12)
      .setFooter({ text: `You now have ${player.deck.length} cards total!` });

    const cardLines = pulled.map((id, i) => {
      const card = CARDS[id];
      const isEx = card.rarity === 'EX' ? ' ✨ **EX CARD!**' : '';
      const isLeg = card.rarity === 'LEGENDARY' ? ' 🌟 **LEGENDARY!!**' : '';
      return `**Card ${i + 1}:** ${card.emoji} **${card.name}**${isEx}${isLeg} — ${card.hp}HP`;
    });
    embed.addFields({ name: '🎴 You got:', value: cardLines.join('\n') });
    await interaction.editReply({ embeds: [embed] });
  }

  // ── /deck ──
  else if (interaction.isChatInputCommand() && interaction.commandName === 'deck') {
    const player = getPlayer(interaction.user.id);
    await interaction.reply({ embeds: [buildDeckEmbed(interaction.user.id, player)] });
  }

  // ── /name ──
  else if (interaction.isChatInputCommand() && interaction.commandName === 'name') {
    const userId = interaction.user.id;
    const player = getPlayer(userId);
    const cardId = interaction.options.getString('card');
    const nickname = interaction.options.getString('nickname');

    if (!player.deck.includes(cardId)) {
      return interaction.reply({ content: `❌ You don't have **${CARDS[cardId].name}** in your deck! Use \`/openpack\` to get it.`, ephemeral: true });
    }

    if (!player.nicknames) player.nicknames = {};
    player.nicknames[cardId] = nickname;
    const card = CARDS[cardId];

    const embed = new EmbedBuilder()
      .setTitle('✏️ Nickname Set!')
      .setDescription(`${card.emoji} **${card.name}** is now nicknamed **"${nickname}"**!`)
      .setColor(card.color);
    await interaction.reply({ embeds: [embed] });
  }

  // ── /arenas ──
  else if (interaction.isChatInputCommand() && interaction.commandName === 'arenas') {
    const embed = new EmbedBuilder()
      .setTitle('🏟️ TFCImon Arenas')
      .setDescription('Defeat the guardian to claim an arena! Use `/challenge` to fight.')
      .setColor(0x00cec9);

    for (const arena of Object.values(ARENAS)) {
      const holder = arena.holder
        ? `👑 **Holder:** ${arena.holderName}`
        : '🔓 *Unclaimed — defeat the guardian!*';
      embed.addFields({
        name: `${arena.emoji} ${arena.name}`,
        value: `${arena.description}\n${holder}\n🛡️ Guardian: **${arena.guardian.name}** (${arena.guardian.hp}HP)`,
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  // ── /challenge ──
  else if (interaction.isChatInputCommand() && interaction.commandName === 'challenge') {
    const userId = interaction.user.id;
    const player = getPlayer(userId);
    const arenaId = interaction.options.getString('arena');
    const arena = ARENAS[arenaId];

    if (player.deck.length === 0) {
      return interaction.reply({ content: '❌ You have no cards! Use `/openpack` first.', ephemeral: true });
    }

    // Pick a random card from their deck
    const cardId = player.deck[Math.floor(Math.random() * player.deck.length)];
    const card = CARDS[cardId];
    const battleId = `arena_${arenaId}_${userId}_${Date.now()}`;

    activeArenaBattles.set(battleId, {
      battleId,
      arenaId,
      userId,
      userName: interaction.user.displayName,
      cardId,
      playerHp: card.hp,
      playerEnergy: 3,
      guardianHp: arena.guardian.hp,
      guardianEnergy: arena.guardian.energy,
    });

    const embed = new EmbedBuilder()
      .setTitle(`${arena.emoji} Arena Challenge: ${arena.name}`)
      .setDescription(`**${interaction.user.displayName}** steps into the arena...\n\n${arena.guardian.emoji} **${arena.guardian.name}** blocks the way!`)
      .setColor(arena.color)
      .addFields(
        { name: `${card.emoji} Your Card`, value: `**${card.name}** — ${card.hp}HP`, inline: true },
        { name: '⚔️ VS', value: '──────', inline: true },
        { name: `${arena.guardian.emoji} Guardian`, value: `**${arena.guardian.name}** — ${arena.guardian.hp}HP`, inline: true },
      )
      .setFooter({ text: 'You go first!' });

    await interaction.reply({ embeds: [embed] });
    await sendArenaBattleState(interaction.channel, battleId);
  }

  // ── BUTTONS ──
  else if (interaction.isButton()) {
    const customId = interaction.customId;

    // Player vs Player battle buttons
    if (customId.startsWith('accept_') || customId.startsWith('decline_')) {
      const battleId = customId.replace('accept_', '').replace('decline_', '');
      const battle = activeBattles.get(battleId);
      if (!battle) return interaction.reply({ content: '❌ This battle expired.', ephemeral: true });
      if (interaction.user.id !== battle.opponent.id)
        return interaction.reply({ content: '❌ Only the challenged player can respond!', ephemeral: true });

      if (customId.startsWith('decline_')) {
        activeBattles.delete(battleId);
        return interaction.update({ content: `❌ ${battle.opponent.name} declined the battle.`, embeds: [], components: [] });
      }

      battle.accepted = true;
      await interaction.update({ components: [] });
      const cCard = CARDS[battle.challenger.cardId];
      const oCard = CARDS[battle.opponent.cardId];
      await sendBattleState(interaction.channel, battle, cCard, oCard, battleId);
    }

    // PvP move buttons
    else if (customId.startsWith('move_') && !customId.startsWith('move_arena_')) {
      const parts = customId.split('_');
      const moveIndex = parseInt(parts[parts.length - 1]);
      const battleId = parts.slice(1, parts.length - 1).join('_');
      const battle = activeBattles.get(battleId);

      if (!battle) return interaction.reply({ content: '❌ Battle not found.', ephemeral: true });
      if (interaction.user.id !== battle.turn)
        return interaction.reply({ content: "❌ It's not your turn!", ephemeral: true });

      const isChallenger = interaction.user.id === battle.challenger.id;
      const attacker = isChallenger ? battle.challenger : battle.opponent;
      const defender = isChallenger ? battle.opponent : battle.challenger;
      const attackerCard = CARDS[attacker.cardId];
      const move = attackerCard.moves[moveIndex];

      if (!move) return interaction.reply({ content: '❌ Invalid move.', ephemeral: true });
      if (attacker.energy < move.cost)
        return interaction.reply({ content: `❌ Not enough energy! Need ${move.cost}⚡, have ${attacker.energy}⚡.`, ephemeral: true });

      attacker.energy -= move.cost;
      defender.hp = Math.max(0, defender.hp - move.damage);
      attacker.energy = Math.min(attacker.energy + 1, 6);
      defender.energy = Math.min(defender.energy + 1, 6);
      battle.turn = defender.id;

      await interaction.update({ components: [] });

      if (defender.hp <= 0) {
        activeBattles.delete(battleId);
        const cCard = CARDS[battle.challenger.cardId];
        const oCard = CARDS[battle.opponent.cardId];
        const winEmbed = new EmbedBuilder()
          .setTitle('🏆 Battle Over!')
          .setDescription(`**${attacker.name}** wins!\n${move.emoji} **${move.name}** dealt **${move.damage}** as the finishing blow!`)
          .setColor(0xf1c40f)
          .addFields(
            { name: `${cCard.emoji} ${battle.challenger.name}`, value: `HP: ${battle.challenger.hp}`, inline: true },
            { name: `${oCard.emoji} ${battle.opponent.name}`, value: `HP: ${battle.opponent.hp}`, inline: true },
          );
        return interaction.channel.send({ embeds: [winEmbed] });
      }

      const cCard = CARDS[battle.challenger.cardId];
      const oCard = CARDS[battle.opponent.cardId];
      await sendBattleState(interaction.channel, battle, cCard, oCard, battleId,
        `${move.emoji} **${attacker.name}** used **${move.name}** → **${move.damage}** damage!`);
    }

    // Arena move buttons
    else if (customId.startsWith('move_arena_')) {
      // move_arena_{battleId}_{moveIndex}
      const parts = customId.split('_');
      const moveIndex = parseInt(parts[parts.length - 1]);
      const battleId = parts.slice(1, parts.length - 1).join('_');
      const ab = activeArenaBattles.get(battleId);

      if (!ab) return interaction.reply({ content: '❌ Arena battle not found.', ephemeral: true });
      if (interaction.user.id !== ab.userId)
        return interaction.reply({ content: '❌ This is not your arena battle!', ephemeral: true });

      const card = CARDS[ab.cardId];
      const arena = ARENAS[ab.arenaId];
      const move = card.moves[moveIndex];

      if (!move) return interaction.reply({ content: '❌ Invalid move.', ephemeral: true });
      if (ab.playerEnergy < move.cost)
        return interaction.reply({ content: `❌ Not enough energy! Need ${move.cost}⚡, have ${ab.playerEnergy}⚡.`, ephemeral: true });

      // Player attacks
      ab.playerEnergy -= move.cost;
      ab.guardianHp = Math.max(0, ab.guardianHp - move.damage);
      ab.playerEnergy = Math.min(ab.playerEnergy + 1, 6);
      ab.guardianEnergy = Math.min(ab.guardianEnergy + 1, 6);

      await interaction.update({ components: [] });

      const playerLog = `${move.emoji} **${ab.userName}** used **${move.name}** → **${move.damage}** damage!`;

      // Check guardian defeated
      if (ab.guardianHp <= 0) {
        activeArenaBattles.delete(battleId);
        const wasHolder = arena.holder;
        const wasHolderName = arena.holderName;
        arena.holder = ab.userId;
        arena.holderName = ab.userName;

        const winEmbed = new EmbedBuilder()
          .setTitle(`${arena.emoji} Arena Conquered!`)
          .setDescription(
            `👑 **${ab.userName}** has defeated **${arena.guardian.name}** and claimed **${arena.name}**!\n\n` +
            (wasHolder ? `*${wasHolderName} has lost their arena.*` : '*The arena is claimed for the first time!*')
          )
          .setColor(0xf1c40f)
          .setFooter({ text: 'Use /arenas to see all holders!' });
        return interaction.channel.send({ embeds: [winEmbed] });
      }

      // Guardian's turn — smart AI
      const guardianMove = aiPickMove(arena.guardian, ab.guardianEnergy);
      ab.guardianEnergy -= guardianMove.cost;
      ab.playerHp = Math.max(0, ab.playerHp - guardianMove.damage);
      ab.guardianEnergy = Math.min(ab.guardianEnergy + 1, 6);
      ab.playerEnergy = Math.min(ab.playerEnergy + 1, 6);

      const guardianLog = `${guardianMove.emoji} **${arena.guardian.name}** used **${guardianMove.name}** → **${guardianMove.damage}** damage!`;

      // Check player defeated
      if (ab.playerHp <= 0) {
        activeArenaBattles.delete(battleId);
        const loseEmbed = new EmbedBuilder()
          .setTitle(`${arena.emoji} Defeated!`)
          .setDescription(`💀 **${ab.userName}** was defeated by **${arena.guardian.name}**!\n\n*The arena remains ${arena.holder ? `held by **${arena.holderName}**` : 'unclaimed'}.*`)
          .setColor(0xe74c3c);
        return interaction.channel.send({ embeds: [loseEmbed] });
      }

      await sendArenaBattleState(interaction.channel, battleId, `${playerLog}\n${guardianLog}`);
    }
  }

  // ── /battle PvP ──
  else if (interaction.isChatInputCommand() && interaction.commandName === 'battle') {
    const challenger = interaction.user;
    const opponent = interaction.options.getUser('opponent');

    if (opponent.id === challenger.id)
      return interaction.reply({ content: '❌ You cannot battle yourself!', ephemeral: true });
    if (opponent.bot)
      return interaction.reply({ content: '❌ You cannot battle a bot!', ephemeral: true });

    const challengerPlayer = getPlayer(challenger.id);
    const opponentPlayer = getPlayer(opponent.id);

    if (challengerPlayer.deck.length === 0)
      return interaction.reply({ content: '❌ You have no cards! Use `/openpack` first.', ephemeral: true });
    if (opponentPlayer.deck.length === 0)
      return interaction.reply({ content: `❌ ${opponent.displayName} has no cards yet!`, ephemeral: true });

    const battleId = `${challenger.id}-${opponent.id}-${Date.now()}`;
    const challengerCardId = challengerPlayer.deck[Math.floor(Math.random() * challengerPlayer.deck.length)];
    const opponentCardId = opponentPlayer.deck[Math.floor(Math.random() * opponentPlayer.deck.length)];
    const cCard = CARDS[challengerCardId];
    const oCard = CARDS[opponentCardId];

    activeBattles.set(battleId, {
      battleId,
      challenger: { id: challenger.id, name: challenger.displayName, cardId: challengerCardId, hp: cCard.hp, energy: 3 },
      opponent: { id: opponent.id, name: opponent.displayName, cardId: opponentCardId, hp: oCard.hp, energy: 3 },
      turn: challenger.id,
      accepted: false,
    });

    const embed = new EmbedBuilder()
      .setTitle('⚔️ TFCImon Battle Challenge!')
      .setDescription(`${challenger.displayName} challenges ${opponent} to a battle!`)
      .setColor(0xe74c3c)
      .addFields(
        { name: `${cCard.emoji} ${challenger.displayName}'s Card`, value: `**${cCard.name}** — ${cCard.hp}HP`, inline: true },
        { name: '⚔️ VS', value: '─────', inline: true },
        { name: `${oCard.emoji} ${opponent.displayName}'s Card`, value: `**${oCard.name}** — ${oCard.hp}HP`, inline: true },
      )
      .setFooter({ text: `${opponent.displayName}, do you accept?` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`accept_${battleId}`).setLabel('✅ Accept Battle').setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`decline_${battleId}`).setLabel('❌ Decline').setStyle(ButtonStyle.Danger),
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
});

// ─── SEND PVP BATTLE STATE ────────────────────────────────────────────────────

async function sendBattleState(channel, battle, cCard, oCard, battleId, lastAction = null) {
  const currentTurnPlayer = battle.turn === battle.challenger.id ? battle.challenger : battle.opponent;
  const currentCard = CARDS[currentTurnPlayer.cardId];

  const embed = new EmbedBuilder()
    .setTitle('⚔️ TFCImon Battle!')
    .setColor(0x2ecc71)
    .addFields(
      { name: `${cCard.emoji} ${battle.challenger.name} — ${cCard.name}`, value: `❤️ \`${hpBar(battle.challenger.hp, cCard.hp)}\`\n⚡ Energy: ${battle.challenger.energy}` },
      { name: `${oCard.emoji} ${battle.opponent.name} — ${oCard.name}`, value: `❤️ \`${hpBar(battle.opponent.hp, oCard.hp)}\`\n⚡ Energy: ${battle.opponent.energy}` },
    )
    .setFooter({ text: `🎮 It's ${currentTurnPlayer.name}'s turn!` });

  if (lastAction) embed.setDescription(lastAction);

  const row = new ActionRowBuilder();
  for (let i = 0; i < currentCard.moves.length; i++) {
    const move = currentCard.moves[i];
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`move_${battleId}_${i}`)
        .setLabel(`${move.emoji} ${move.name} (${move.cost}⚡, ${move.damage}dmg)`)
        .setStyle(move.isEx ? ButtonStyle.Danger : ButtonStyle.Primary)
        .setDisabled(currentTurnPlayer.energy < move.cost)
    );
  }

  await channel.send({ embeds: [embed], components: [row] });
}

// ─── SEND ARENA BATTLE STATE ──────────────────────────────────────────────────

async function sendArenaBattleState(channel, battleId, lastAction = null) {
  const ab = activeArenaBattles.get(battleId);
  if (!ab) return;

  const card = CARDS[ab.cardId];
  const arena = ARENAS[ab.arenaId];

  const embed = new EmbedBuilder()
    .setTitle(`${arena.emoji} ${arena.name} — Arena Battle!`)
    .setColor(arena.color)
    .addFields(
      { name: `${card.emoji} ${ab.userName} — ${card.name}`, value: `❤️ \`${hpBar(ab.playerHp, card.hp)}\`\n⚡ Energy: ${ab.playerEnergy}` },
      { name: `${arena.guardian.emoji} ${arena.guardian.name}`, value: `❤️ \`${hpBar(ab.guardianHp, arena.guardian.hp)}\`\n⚡ Energy: ${ab.guardianEnergy}` },
    )
    .setFooter({ text: `Your turn, ${ab.userName}!` });

  if (lastAction) embed.setDescription(lastAction);

  const row = new ActionRowBuilder();
  for (let i = 0; i < card.moves.length; i++) {
    const move = card.moves[i];
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(`move_${battleId}_${i}`)
        .setLabel(`${move.emoji} ${move.name} (${move.cost}⚡, ${move.damage}dmg)`)
        .setStyle(move.isEx ? ButtonStyle.Danger : ButtonStyle.Primary)
        .setDisabled(ab.playerEnergy < move.cost)
    );
  }

  await channel.send({ embeds: [embed], components: [row] });
}

// ─── START ────────────────────────────────────────────────────────────────────

(async () => {
  await registerCommands();
  await client.login(BOT_TOKEN);
})();