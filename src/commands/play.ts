import { ApplicationCommandData } from "discord.js";
import { getQueue } from "../player/queue";
import { YoutubeTrack } from "../player/track";
import { addCommandHandler, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  name: "play",
  description: "Add a track to the playlist.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "url",
      type: "STRING",
      description: "What should I play?",
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);

  const url = interaction.options.getString("url");
  if (url) {
    const track = new YoutubeTrack(url);
    queue.addTrack(track);

    await interaction.reply({
      content: `🤘 _${track}_ added to your queue.`,
      ephemeral: true,
    });
  }

  console.log(queue);

  console.log(interaction.replied);

  // interaction.reply({ content: ";)", ephemeral: true });
  // // }
});
