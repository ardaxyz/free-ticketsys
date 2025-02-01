const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const config = require("../Configs/main.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-ticket")
    .setDescription("Setup TicketPanel")
    .addChannelOption((option) =>
      option.setName("channel").setDescription("Choice a Channel")
    ),
  async execute(interaction) {
    const channel =
      interaction.options.getChannel("channel") || interaction.channel;
    if (
      interaction.member.guild.roles.cache.has(config.ticketsystem.panel.rechte)
    ) {
      return interaction.reply({
        content: config.ticketsystem.panel.msg,
        ephemeral: true,
      });
    }
    const embed = new EmbedBuilder()
      .setDescription("Klicke den Button um eine Kategorie auszuwählen.")
      .setColor("#5865F2")
      .setTitle("Ticket System | Panel");
    const btn = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("open-menu")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Öffne ein Ticket")
    );
    await channel.send({ embeds: [embed], components: [btn] });
    return interaction.reply({
      content: "Ticketpanel wurde erfolgreich eingerichtet!",
      ephemeral: true,
    });
  },
};
