const {
  Events,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const config = require("../Configs/main.json");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.customId === "open-menu") {
      const menu = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("select-menu")
          .setPlaceholder("Wähle eine Kategorie aus.")
          .addOptions(
            config.ticketsystem.categories.map((row) => ({
              label: row.name,
              emoji: row.emoji,
              value: `${row.name}|${row.categoryid}`,
            }))
          )
      );

      return interaction.reply({ components: [menu], ephemeral: true });
    }

    if (interaction.customId === "select-menu") {
      const values = interaction.values[0].split("|");
      const name = values[0];
      const id = values[1];

      try {
        const channel = await interaction.guild.channels.create({
          name: `ticket-${name}`,
          parent: id,
          type: ChannelType.GuildText,
          topic: `Ticket von ${interaction.user.username}`,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              deny: [
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ViewChannel,
              ],
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ViewChannel,
              ],
            },
            ...config.ticketsystem.showticket.rechte.map((roleId) => ({
              id: roleId,
              allow: [
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ViewChannel,
              ],
            })),
          ],
        });

        const embed = new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`Dein Ticket wurde erfolgreich erstellt! ${channel}`);

        await interaction.update({
          embeds: [embed],
          components: [],
          ephemeral: true,
        });

        setTimeout(async () => {
          const ticketEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(
              `Hey ${interaction.user}, beschreibe bitte dein Anliegen. Ein Teammitglied wird sich sofort um dich kümmern!`
            );

          const btns = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("close-ticket")
              .setLabel("Close Ticket")
              .setStyle(ButtonStyle.Danger)
          );

          await channel.send({
            embeds: [ticketEmbed],
            components: [btns],
          });
        }, 1000);
      } catch (error) {
        await interaction.reply({
          content: "Es gab einen Fehler beim Erstellen deines Tickets!",
          ephemeral: true,
        });
      }
    }
    if (interaction.customId === "close-ticket") {
      const btns = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("delete-ticket")
          .setLabel("Delete Ticket")
          .setStyle(ButtonStyle.Danger)
      );
      return interaction.reply({ components: [btns] });
    }
    if (interaction.customId === "delete-ticket") {
      return interaction.channel.delete();
    }
  },
};
