import Nav from "@/components/Nav";
import { useProfileQuery } from "@/lib/hooks/api";
import { SuiEvent } from "@mysten/sui.js/client";
import { withZkLoginSessionRequired } from "@shinami/nextjs-zklogin/client";
import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '@/lib/hooks/fetchProfile'
import { GetServerSideProps, NextPage } from 'next';
import { MYPOST_MOVE_PACKAGE_ID, GLOBAL_OBJECT_ID, API_HOST } from '@/lib/api/move'

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     let body = {
//         package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
//         profile_id: 'id',
//         profile_meta_id: 'meta_id',
//         profile_pool_id: 'pool',
//         global_id: `${GLOBAL_OBJECT_ID}`,
//         address: 'address',
//         create_at: new Date()
//     }
//     // update profile data in db
//     const profileRes = await fetch(`${API_HOST}/api/profile/mutatedb`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//           },
//         body: JSON.stringify(body)
//     })
//     if (!profileRes.ok) {
//         throw new Error(`Error: ${profileRes.status}`);
//     }
//     let profileJson = await profileRes.json()
//     console.log(JSON.stringify(profileJson))
//     return { props: { profileRes } };
// }

function Profile2({ session }) {
    const { user, localSession } = session;

    const handleClick = async () => {
        let body = {
            package_id: `${MYPOST_MOVE_PACKAGE_ID}`,
            profile_id: 'id',
            profile_meta_id: 'meta_id',
            profile_pool_id: 'pool',
            global_id: `${GLOBAL_OBJECT_ID}`,
            address: 'address',
            create_at: new Date()
        }
        // update profile data in db
        const profileRes = await fetch(`${API_HOST}/api/profile/mutatedb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(body)
        })
        if (!profileRes.ok) {
            throw new Error(`Error: ${profileRes.status}`);
        }
        let profileJson = await profileRes.json()

        let followBody = {
            follower: 'follower1',
            following: 'following2',
            follower_profile: 'follower_profile',
            follower_id: 'follower_id',
            following_profile: 'following_profile',
            following_id: 'following_id',
            price: 'price',
            create_at: new Date()
        }
        const followRes = await fetch(`${API_HOST}/api/follow/mutatedb`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(followBody)
        })
        let followJson = await followRes.json()
    }

    return (
        <Nav bottomIndex={4} leftIndex={-1} user={user}>
            {/* {JSON.stringify(profileRes)} */}
            <button onClick={handleClick}>click</button>
            {/* {JSON.stringify(filteredtsx)} */}
        </Nav>
    )

}

// export default withZkLoginSessionRequired(({session }) => {
//     const { user, localSession } = session;
//     // const { data: txs, isLoading: isLoadingTxs } = useProfileQuery()
//     // let filteredtsx = txs?.events.filter((e) => e.sender === '0x90f82b8043b5570461cad52ac132141403d763da69eb3fd46f34051324b7182b')
//     // const { data, isLoading , error } = useQuery({
//     //     queryKey: ["api", "profile"], 
//     //     queryFn: fetchProfile
//     // });
//     const { data, isLoading , error } = useProfileQuery();


//     if (isLoading) return <div>Loading...</div>;
//     // if (error) return <div>An error occurred</div>;

//     return (
//         <Nav bottomIndex={4} leftIndex={-1} user={user}>
//             {JSON.stringify(data)}
//             {/* {JSON.stringify(filteredtsx)} */}
//         </Nav>
//     )

// })

export default withZkLoginSessionRequired(Profile2);