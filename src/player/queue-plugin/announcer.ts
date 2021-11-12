import { Message, MessageEmbed } from "discord.js";
import { getBot } from "../../bot";
import { createBaseEmbed } from "../../util/message";
import { msToDuration } from "../../util/string";
import { QueuePlugin } from "../queue-plugin";
import { Track } from "../track";

const announcements = new Map<string, Message>();

const onPlay: QueuePlugin["onPlay"] = async (params) => {
  const bot = getBot(params.guildId);
  const channel = bot.textChannel;
  if (!channel) return;

  const embed = createEmbed(params.track);

  const currMessage = announcements.get(params.guildId);
  if (currMessage) {
    // delete previous message
    await currMessage.delete().catch(() => {});

    // // remove buttons
    // await currMessage.edit({ components: [] }).catch(() => {});
  }

  const message = await channel.send({
    embeds: [embed],
    components: [
      {
        type: "ACTION_ROW",
        components: [
          {
            customId: "StartOver",
            type: "BUTTON",
            style: "PRIMARY",
            label: "Start over",
          },
          {
            customId: "Skip",
            type: "BUTTON",
            style: "PRIMARY",
            label: "Skip",
          },
        ],
      },
    ],
  });

  announcements.set(params.guildId, message);
};

const Announcer: QueuePlugin = {
  onPlay,
};
export default Announcer;

function createEmbed(track: Track): MessageEmbed {
  const embed = createBaseEmbed();

  const author = track.userRef?.deref();
  if (author) {
    embed.setDescription(`${author} added a new track:\n**${track}**`);
  } else {
    embed.setDescription(`**${track}**`);
  }

  if (track.url) {
    embed.addField("Url", track.url);
    embed.setURL(track.url);
  }

  embed.addField("Duration", msToDuration(track.duration));

  if (track.thumbnail) {
    embed.setThumbnail(track.thumbnail);
  }

  return embed;
}