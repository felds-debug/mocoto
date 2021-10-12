import { getVoiceConnection } from "@discordjs/voice";
import { ApplicationCommandData, GuildMember } from "discord.js";
import { getQueue } from "../player/queue";
import { YoutubeTrack } from "../player/track";
import { addCommandHandler, join, registerCommand } from "../util/discord";

const command: ApplicationCommandData = {
  name: "play",
  description: "Add a track to the playlist.",
  type: "CHAT_INPUT",
  options: [
    {
      name: "url",
      type: "STRING",
      description: "What should I play?",
      required: true,
    },
  ],
};

registerCommand(command);

addCommandHandler(command, async (interaction) => {
  const member = interaction.member as GuildMember;
  const guild = interaction.guild!;
  const queue = getQueue(guild.id);

  /** @fixme When "disconnected" with leave, getVoiceConnection still returns a connection. */
  const connection = getVoiceConnection(guild.id);
  if (!connection) {
    join(member);
  }

  const url = interaction.options.getString("url");
  if (url) {
    await interaction.deferReply({ ephemeral: true });

    const track = await YoutubeTrack.fromUrl(url);
    queue.addTrack(track);

    if (queue.isIdle()) {
      queue.play();
    }

    await interaction.editReply({
      content: `🤘 _"${track}"_ added to your queue.`,
    });
  }

  interaction.replied || interaction.reply({ content: "👌", ephemeral: true });

  countSecs();
});

let secs = 0;
function countSecs() {
  console.log("secs", secs++);
  setTimeout(countSecs, 1000);
}
