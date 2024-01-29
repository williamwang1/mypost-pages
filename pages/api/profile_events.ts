import { sui } from "@/lib/api/shinami";
import { ProfileEventsRes } from "@/lib/shared/interfaces";
import { withZkLoginUserRequired } from "@shinami/nextjs-zklogin/server/pages";
import { ProfileMetadataCreated, ProfileEvents } from '@/types/profile'

// This is an auth-protected API route, augmented with user's zkLogin info.
export default withZkLoginUserRequired<ProfileEventsRes>(
  sui,
  async (_, res, user) => {
    // This Sui query can easily be performed on the client side as well.
    const metas = await sui.queryEvents({
      query: {
        //And: [{MoveEventType: '0x15c9eeb1795d7a5d1fd78224e4b6caf71abb0d8283cf917a18ce485ac5bd560f::profile::ProfileMetaDataAdded'}, {Sender: '0x90f82b8043b5570461cad52ac132141403d763da69eb3fd46f34051324b7182c'}]
        //MoveEventType: '0x9f36f5986ed7f4b13fb77463ba9b73d25e1f48049217a02b0b5e3f3488ce9189::profile::ProfileMetaDataCreated'
        Sender: '0x90f82b8043b5570461cad52ac132141403d763da69eb3fd46f34051324b7182b'
        // All: []
      },
      order: "descending",
      limit: 1,
    });
    res.json({ events: metas.data, address: user.wallet});
  }
);
