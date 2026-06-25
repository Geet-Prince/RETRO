import { Track, Listener, ChatMessage, UserProfile } from "./types";

export const MOCK_TRACKS: Track[] = [
  {
    id: "track-1",
    title: "ANALOG DREAMS",
    artist: "THE SYNTHWAVE COLLECTIVE",
    album: "SYNTH SYSTEM VOL. I",
    duration: "04:12",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-GWyUR8eadDc3MxxV0F2rcMmetoptiNzg1s3sohnqymXkagsdECCj6ch7JFA7Ro9zQqxJcmT1oyY-_v3yr3Csu6_P0dQ86FuwmIXKrUxsGznQSO5eAbBZ4MTxZ29jzNBCVlQwtiYaHZ67womJdtF0TjX7oYT4k7JXdwYKoLK_c0czPHgJXtFFbDc25bQEbl8Z-GFnx6W38Sin6lpzieMh4d3Y5bhrN47rtD2YGxLqEYs9YM9oyF7gyUrHmpmQMJQQS1nmYF5o63I",
    genre: "SYNTHWAVE",
    listeners: "1.2M",
    audioUrl: "220" // low warm synth wave
  },
  {
    id: "track-2",
    title: "MIDNIGHT JAZZ",
    artist: "BLUE NOTE QUARTET",
    album: "SMOKY SAXOPHONE REC",
    duration: "03:58",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-CpxTcKMdhT4KrQXOo97XcaRdTADgCuP8HEw5KnnCWtLr9bcOawaMupwSJRkMQznPVt6yliBn7SIiZgGgBnVFskHAFCWaDLaEDmunbtqv8tBrH3RymLcfN74MNy-sQxFPSQtjuae4JqAmY1VqvIaw3Mziz_xItY2bji70TEgMbhwKUus7gDjP2Wib_NofGt23wxhn7JDx-LGDQKZSHJJNtmsAUtCa-4UoBybwEhwRm_K5FchAPViA5Qw95geaS70Tcs8Hs0XWozM",
    genre: "CLASSIC",
    listeners: "850K",
    audioUrl: "293"
  },
  {
    id: "track-3",
    title: "DUST & ECHOES",
    artist: "STATIC BLOOM",
    album: "SATELLITE EP",
    duration: "05:10",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9YO9GTI5RGB6hG9Ydiuvq0tSqsAgB4O2iE06eXn_QBFl2CLr8enIxJzpYW-jHC5I4IObZw6rsp_g9NY442wHGleBbCkbONJDjjQKqBf_IfRqmjYDP2skceIXuxqKLXdl9sqnRgR-VmXeFOFfwYUx7Wq8w2Gac6TOpFHSyA6fqNm97WRg6eQxz7vqDz5lZCASRer1JVxxFIRx-Q_xLJjYH6WhY34fZ4Y1YDfyc6JpavEjjmQGyunpBIwyxLTsMfDQNAjFEAMOJi2s",
    genre: "AMBIENT",
    listeners: "920K",
    audioUrl: "329"
  },
  {
    id: "track-4",
    title: "WHITE SPACE",
    artist: "NULL SIGNAL",
    album: "SILENT PROTOCOL",
    duration: "06:12",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqlI8ZfRN3M1egojRBcSu7ksa9WvT5mD8LrsNoNJPJf65x-OmE8OqNt4zmLlzTjYXxFX2bgtRPeeYfFPtmQvmAxJIki38VT5ZVdD2BRzsEXZEfbpUG98vZRGjm1BYlMli-z5h4XsaRoF7wZ1LtuJRLZCwYur-NWLc1mrbPpCiEuEA7W8x3_bFM-9BqV743ArD6Pwoqb9BGna-gGsjQCvhQUmB3wkZZs-BVcFKSCdi-sxXa62mZL33rErSs-YSDLsNZ6VBmzLcTJTY",
    genre: "NEW_WAVE",
    listeners: "410K",
    audioUrl: "440"
  },
  {
    id: "track-5",
    title: "ANALOG WAVES VOL. IV",
    artist: "VARIOUS ARTISTS",
    album: "Playlist of the Week",
    duration: "04:30",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCD8GXRSUaxAq8eb19XD41GxwT9-6LleBa9iFP12FUHESa8RCw38TWcKcYWZGr2xnaMHpdPxu02Puw1ckiHifQ5LjaTV0oSSyqhndPETUpmGM_f4vkFcY7hIDRDqjxdFORzSU0ViC69wvK748ix1OAsB5cOuW0sGUeO2_fpdCVrXlQAGx0MOUPL4ymZNEFGeTdI8R5QO70n8-dZauCzGD7_sYFrpzDjotLCqaCGWubmCuuusEMi3DtCYMhjNIc0-JZTXhWWhyaa5LY",
    genre: "90S_RETRO",
    listeners: "2.1M",
    audioUrl: "196"
  },
  {
    id: "track-6",
    title: "MAGNETIC NORTH",
    artist: "FERROCHROME",
    album: "TAPE LOOP SELECTION",
    duration: "03:45",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmU4EXOhj9leo-dkZ1gSInPliw1TChginuTJiyfnCPsbyITTAGzXIyzMel2S-hOdpUJVta6LDOEeZZsFuc3ifLS6vOsEQYzkLRbvdXR6sj9BxUhR-sESk0XU1CgVHNkjgyjyJrPNjBQgdCZMXqYJqX3QGyUgHzAJOLta7PSyy6Apf1kCCT30Dnn1GXxvrSymNf6F8kWYw1PHWpZVq0AiHFNhNyPkzRFX2TKQBUu5dyH5ww9TBIEeWEymJ34Y4YgfeAcWLYKielfFE",
    genre: "INSTRUMENTAL",
    listeners: "680K",
    audioUrl: "147"
  },
  {
    id: "track-7",
    title: "BRUTALIST VIBES",
    artist: "URBAN ECHO",
    album: "CONCRETE BLOCKS",
    duration: "04:15",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKtXfKqsd2joKJm0X79oWIAxiKBKOsbd0ManGe0ENFX-ZWoAT92npjsWopfIR3v2kMHbdOM30PO9rwlomIlLt3CiblSr8MXRHNKGxy1OaGHi6sIoiaXq29kyf6UST3cyDlIvGZSZIgstFAU76tDbwuVT7Jgrj0rFLxntJ4TCWqf-2go5VHIo2Qn_9xLJUNU9MpgvujRB3OMtW_X6rJnX7l-IkHB-UvwPSY9V0_yAAJ9WfB4SBh5KpUpg-uWrTbOjuP-tHzZEunnFg",
    genre: "90S_RETRO",
    listeners: "1.1M",
    audioUrl: "220"
  },
  {
    id: "track-8",
    title: "TERRAIN DATA",
    artist: "SIGNAL PATH",
    album: "GEOMETRIC TOPOLOGY",
    duration: "03:22",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkLSuDTEFhrqtHZt_EKrSeQ5I1UHpDQUJIkVIMzj_265_P1D6jZzDcOhPoSobp0dJmLjVwWWd7nJq97Ch_3YqHbmPKJe62PuA3ZhP1y6naWEH_feWRYqvKkd6-0BxhFRd5S0vsMvLf9zmjsL-vKDQH5pzRxWLFWRQi5MSLSsnnkHCef5ZH3Nta96AtKyZtxJb7IyL3lMhtQR93pwOKXy693fQacxtIzl2kUlNtFgL3nXckb4KQe_ZWkzMGFKFkPISrneCEhPslJJA",
    genre: "NEW_WAVE",
    listeners: "560K",
    audioUrl: "392"
  },
  {
    id: "track-9",
    title: "WAVEFORM NOSTALGIA",
    artist: "SYNTH-01",
    album: "OSCILLATIONS",
    duration: "05:01",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCgfSr81p8FB7Hp1shbSNf1OFxFqCbvFnOFs7isJpMPyg5E6fxpEKINDPY4ThNLecf9ETyV2bPZRJjNghHBt2feCb7cfcx-BO9DZwQ7HrvYvWrRMbtVVTcq79WtFahqVrX8Ocps7hBINB5QTAUoM0K_Mi0Xi7YWshsPNui9C_-NBe6MB4_nhg5TA2KHtXxzOLLwdvwXg2iXF__9PludXR3wSa0ExGyptLbPgRNpn2fJEjZ7SkIwv6RxoC2w0yanI360MG9dVqNAao",
    genre: "SYNTHWAVE",
    listeners: "980K",
    audioUrl: "330"
  },
  {
    id: "track-10",
    title: "NEON HORIZON",
    artist: "LASER GRID",
    album: "CHROME HIGHWAY",
    duration: "04:50",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDakfJ3cyyNVzu5WVEeHpfgXxEVLcCG1aWNGxpuFqKQo2qowZS-iJAM0vabLzxvd5M9KsaMqUy4_2o8OUrNh62ljllK7vlq332JF6BMjRcgN4_K9FUNKgM6q7rGIRbMa4kp9cYmbAmptSOV3bvoK46FnW8q0whJwW9Rp032K0xMKrFe9OAPJSLi31sC8x0XcvNxmzHvjoZQVQly6x4fn1kOWMvcXSVI_DmLZVFc7bnNbxgys1oXxCBaZSm2iH0LUzP77FKwGbiY6eA",
    genre: "SYNTHWAVE",
    listeners: "1.4M",
    audioUrl: "261"
  },
  {
    id: "track-11",
    title: "STATIC DRIFT",
    artist: "WHITE NOISE",
    album: "HISS FREQUENCIES",
    duration: "03:10",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwmn7Uwml1D7eBxWp8zzyjt5LJz514vnXl1TG-AfSDaCLieXLdNjxw1Mq63vwq5XhaCt_E6jSKkspknFMWzOOJDQE-waT4mlLI9_fX8OiQ8oDnd7zF5jvAQvH8_4TlQTuGau-PnUwhOUiYLT3yNgWAR8rxkIYtPM-Yq1hnUlycLBq4WnLDTWsySMH65xGmN7FchwDmj5eoQMuypWmx6D54T_oL9SKxSkb6dWdLss5z5Uzfn1xx2xbmLEiuvaHFEGgfuaaM3Dw7hcM",
    genre: "AMBIENT",
    listeners: "340K",
    audioUrl: "120"
  },
  {
    id: "track-12",
    title: "PEAK STATE",
    artist: "SUMMIT",
    album: "ELEVATION ZERO",
    duration: "05:25",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZx4EH1vu8QX2TgLC0o2ywdNjw0Z8g5DZU18zPqecDXeRb_nlzqlNWCeZzihAQDpuMZzAI50FdL6H8zIje2y7yxxGAaK6xXWX7OJSBAdK0xGEG6Ef9e1U2gDo-Gqhp0F3TV1OLW_rLCa_raoW5xhi-UPI3rUX4QcjQxac_NDZcbvMkTAsLdF4y1pe0BMKVk1XyoBVJ7EEFd5IdbZ6lmWuxsSY55ZiAjnwoPMpIxkaiquiqloHpNaBc6V5LgnYWGqDLBJkyOXJcwYc",
    genre: "AMBIENT",
    listeners: "770K",
    audioUrl: "185"
  },
  {
    id: "track-13",
    title: "GRID LOGIC",
    artist: "VECTOR",
    album: "INTERSECTIONS",
    duration: "04:11",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAG99sUGoPUnQ4VglnxVJ21ptpblzgjmoZyqfqZjIQ7hrQVRiB_o7LmlDuVSrWGFygcAgzmcGFMZXDX3KNtiVkw6POdXXc23P29Ynz0tN06K_oL6IgVDOQaOjekX2puhsgZycunbCLyNRUYgVsld25shIpYUGOTf-POoP4E1IQxTSYNYulve8kisIU954M5rQGMqu7mmvqZvCWwjCDutzAUvQ5AQf62kNpnlizZevxHJ5snwSlDs0BESQU7v1HvLM5yuEB0aKI8WA",
    genre: "INSTRUMENTAL",
    listeners: "910K",
    audioUrl: "293"
  }
];

export const MOCK_LISTENERS: Listener[] = [
  {
    id: "lst-1",
    name: "Stitch (DJ)",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGmeCkoVquhy-m8Wte3R2DcLiclHPKOGO5VuMEqxBYIAruLB_zTodjOPmN7JU5OIrPHAhbjwk8cY7Kp0THzcdmgaNVbyG9oIj_yl2T5cSuv94aQiUjVPw_3jpEVTnnj_BHZrOepyIrINdGNknlshROqesC3brDrNfi2sB7dJQ8E4mCj2PETuYzDpkKIAWWECH_xhVPb-5bNTJa2GqvvSIQ4sTIZ9somhHC5NY-beOV6zEY0TYqMqyfE9V8liqrbhEx4CezJ5Yclms",
    isDj: true
  },
  {
    id: "lst-2",
    name: "User_129",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf_UscxCp7jrRXEPSpxJeTnlXrNfDf9LhSdM-PLmJYRqmjSruUK8XD8Yt7UbB5KVI7lCK3fbzjXJNXTfH00_KpUdTRxeuLb9MCxd2iFvGIUEAIEAGu6nT45nseHKupQ088fD_SMXMMML8Dyp_fD3jMRrB9iqJou-2v-xSDLv7V3aH2QvFgjRFY_V-OnebhXb7usxT8FTwTyqUNZrRxnnPCQpRVOAIsIZMaueoSVidvWmdpcwk5B72kssLT4rmoMTbJ4a8S9ZCZGR0"
  },
  {
    id: "lst-3",
    name: "Luna_Vibe",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDA6V3H-FAEGM7WAowvEkbHyj4RKRzFhi74shnT2J9KlbgO1vOzeHxa42AQa8f5wF3bo0MxKH_-AO-OqTYQJaghtxEYnugiugvWGMySDauj866R0NBZmbITdsGZJRHE-25_Vl2p4Vjht98gRdes9fn_5AfrnnWaKQ0yK_rmDYInPOI9R147CTdq7RS2Uk4Luh482I2Z5eL0HQXeXngr-0w_N2LK2oamoepaZIb50W52QBOENzx4GGlJhpVa3QsdeeBrtXDITlKwoAg"
  },
  {
    id: "lst-4",
    name: "Tape_Deck",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8srFwlxJhVjKpQRP_B6kMY5wFzEQRlRZWxlXEEGShY7bHfKWM71XJyjXysFh2LWRAe5I5vlFqZUlY5Zs7LCs0n54uW4MvxSlAWdSlLcCAqgfDbRfxHaEaDdRbNp72GrYyBgnuxUsDqZ50DEGmQ9yBsIb8hPVViW4i6btT5Xgytimh3TMzWOWKbvKO5lcV4ffa2WFqnACy3DbIFmBcvqGMBVRddYbeAw1l-3ugZWLYLHVfjWkrwBtP80wnh3xu0biNFTFDWwqL304"
  },
  {
    id: "lst-5",
    name: "Meow_Fi",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJOd7xaDaMDt9IFnIZOdK2egTQqK8RKor9hMtNALEP2fKM3piBnteDLYmfTx2mVzkybVGwsAnlX-2yIFlbZJ1s1rkfG-Fh7orQoOlsTyK__D_9RJsQ8QI-tvxVfL3ecpBRQTBHfSqyEfO4bDvdoN4ukhnNsK-y7Pyn_8FsfbgUj3sNGDhGRV_I1qaCPkhyJypym-MpTrmz9lHMJ8g58b50bYrJa3mbvnLbxiZFWUvPq1gS8mgP-Sekwu3PicPObTZotXITJvIO-0Y"
  }
];

export const INITIAL_CHAT_FEED: ChatMessage[] = [
  {
    id: "msg-1",
    user: "Stitch (DJ)",
    text: "Welcome to the drift session. Turning up the bass for this next one.",
    timestamp: "12:45 PM",
    isDj: true
  },
  {
    id: "msg-2",
    user: "Luna_Vibe",
    text: "That transition was smooth!",
    timestamp: "12:46 PM"
  },
  {
    id: "msg-3",
    user: "User_129",
    text: "User_129 joined the room.",
    timestamp: "12:47 PM",
    isSystem: true
  },
  {
    id: "msg-4",
    user: "Tape_Deck",
    text: "Anyone know the sample at 02:40? Sounds like old school modular synth.",
    timestamp: "12:48 PM"
  },
  {
    id: "msg-5",
    user: "Stitch (DJ)",
    text: "It's a Moog Model D through a vintage tape delay. Good ear.",
    timestamp: "12:49 PM",
    isDj: true
  }
];

export const MOCK_PROFILE: UserProfile = {
  name: "AXONOMETRIC",
  idCode: "CURATOR_ID: 8821-XP",
  isPremium: true,
  location: "TOKYO_SUB",
  memberSince: "OCT_1978",
  level: 99,
  minutesCount: 142890,
  tracksCount: 4512,
  collectionCount: 892,
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuiYmL89VIWmay1zAOcQoTq8QGw980tcVWW3XmHLcaThUeBAjwtjBVn3zRynpuYkS0r3drGdS4iqPoo1EgCRPtE8-vH7N--o8up0B-NHY9MDWgarI6-nguFRxXcoF-UUyYPupvGFJO7ugI9Qr2PUJkgPOeRCL5MQJdkNWzqj1317kthel5aERuhct1J5CBVhN-Q7Q5zvwLwoOGeh0gBjvTNcNwk2dyMGnyzcx7xzM08AUL5Izd1E19659zyEgCUiVRfK9crKSlmU8"
};

export const POPULAR_ARTISTS = [
  {
    name: "Satoshi T.",
    listeners: "1.2M Listeners",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAqr12OJnketz4OqKM9RcQMFFj7wtRtRFduPAMHOPBohaVN2RuoumvTw3F6Z2JlZUu2MKM95hNWyE6iSidJJ6M3bUHB3F25ERXSpgnFa0o5EMAx6u8_5ePM9XPxIOaWdS6kiTS6UlMKv53ZKWx5VUot4nyJuwCVNcKkP0ZrG2h5BTLRfGC5YJaMyrrij7vRRcatlCPp1T0tlIEBBxXJCBK97bzzEuCkFvzTxYRZJ0tlkR1WawdtmYpETjmYiv2Xa-R0s-Dr-jZNjeI"
  },
  {
    name: "Lunar Echo",
    listeners: "890K Listeners",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn3AonQlG2NglyXnepBGt9Yoc9C8eMowcOdgZXEK2geWiAFKOjQ-nkgCb9mUmo5DJdUq9JfHjRObptbgloJQaWCPRAQJtrYcMqac0FR_ovnA1YBelE7S-E1yI1xSxSTKUoT_FfNs_zCDwAnJ6KbPjmq8jCQJqG8GHVHHmG27siShJNTmBnh_zZQY4qGEHxHn57flJLtJ6kpFcTAMLEW4ZtPv3YaOyrz4HMaJ0i2GKM4lD7cIEIpLROj033mmmNWUiJc7k-Pyrj-7k"
  },
  {
    name: "The Signal",
    listeners: "2.5M Listeners",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8VlwHe6IMkREbL4FmEj_1HUo4KlJ3rcunZmJDFUXWPYqC3NJEtfW75cuweNEIxfqExgYozGh_vOq0KP5HtHRNaapy7kBaOcA90JePh0uyNzZXv6teANBpFkqKsXJbphEjNPwGphE_-ZMyBuGZq_UhRB8LizJNvIYwVYyhThXZumFKq5KEtyadbu7dUfjs2MCYatJRrO7no1aosZWsv3Q6vJh75FOcu22aMIh6f7L8rjN2SqQ1r3Znlo0E-jsS6Q3cgJX42-9IMRQ"
  }
];

export const TOP_ARTISTS_CIRCLES = [
  {
    name: "MILES_D",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSEh22eFnu6bk3JXc1t5sFR4ibK1qiiP5GGFscXtXEDOh6swP8cMXrpFB7EwFGoQAHyXNERm1ltpvhNMKya6xvnf8m3F7cFraqr0Q-X14V-p-zkAadhTUq6USW9vNUMooVLjtwK-LEP8QyoeJ6vkBYRlunwGwWmxbw1Drbd5aKrWBARgStfmJ0arAfzCae_AIbQwgOwIeI_RtDPq8h9ox-RJgOCBtRDVyd0M1OMllPTjzHJwmsC8cDanWvk5Lr2CX4WFqBif3W7SY"
  },
  {
    name: "KRAFT_W",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuANywAB3YU0wskAjJtHCTdLKoFt3YJypxVlDaxjvEVy7or8TDf7WgrcHiOX0qJkhoCdHfTxeXFHp1N1liMuj3D-P4yVAf-G3dvmTEygYeKjY2Ut7x89fcuwG4-EUvY7Vt5ySln24qXVZ9ZvzHHtJUyNawp7MIVDvTyLwLfK4BsZLoYmDZJxlKvmLbuCC_Qc9PHf0AJ1N5CPIKBSjXyhtyrZ9vb9o8IXg-5r4ObS1Kjlbno3gjBGB9Fjmt9toeGHTeXoD5W6zMB_SGE"
  },
  {
    name: "JONI_M",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6ENVP4O1lvtMCmN1FfU3d6nzqJClPW9uApSpUxvylKv-PElbB0_sYDeszhNsQPXfby4sNKzTZ3etWkLGGYTnP3awgYj8iOzX4Xlv_kEqqK_d3cm-UwwovEYL_g2wtDeXcTKQ9i3VP2jpKuxLSEFRiVqnkUEQ1uq1GvBNvTMl1CWS5TbFNVWyBHkXgQ6uWM7kc4p9iGSlNHmiXmVssAHPtmzl4GgbMD431Iye09AXkVh100Q1HZ6-_LOVJTBoeigTEPha1jkdUxkk"
  },
  {
    name: "SYSTEM_7",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnk_K4DauIep-Dbqb6vdwBWnAhEeey6z-_neEakQ4R-vh8yKJbcdV8Nb_jpu62-fKxhFwCa3PanFqJ72p6wkWkDQ-JXrbTlX4GsggC9B-UobP4nsnbHcVgiI7n0Qb1EG-QNSNEZRpGnQUkmziF9QmMd1ujSCdvQJqEI16sYX5N4ijOZJ46_sIwOBBneMJDYGkmnao6S0OMtHZPvH4C1JGJHEko-J9-FAfUb-6ul6Er_gMcvWHfy0c81ZFbeh3lsVg67SGH2TQu9us"
  },
  {
    name: "STEVE_R",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiDGYg6iqKkb7QEKQWvgLia3P18pSQbvtbv7cNOMzfpve4OhMxrvLLePdenHUEwOF93mtQNqekuFWS7gfIgWH75d7pbFCqfHT3mOWQ5GV2w7_eaph2JN6_6b5JpCQGhWfVPDDG8yaUdnk7yQte3c5bRwGHcFMcKq6JCTyThnSpA4rq6Q9IWi1_dhHXwsgoB8Cr2qVhxbJ89OkYdDlkvjQ1XN4sKuBDLAsTp8gxEuaIK97I7ulihRo1FhD7vO4iGeTrddtbgxhhKH4"
  }
];

export const HEAVY_ROTATION_CDS = [
  {
    title: "BITCHES_BREW",
    artist: "MILES_DAVIS",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXYyGc2xuflMFrhrK86xLNGontmS-N8QV-AC466j6ixNz9Zrc_M__nO_Is2IujUHTWM_Mvp1Sfe4n8_Iys497Pba5qLjPmcLNwBCSoL-NovKYjkw1F1msMQ5KlnC1vknH665eW1H66haj2bE6iFQriMwGlXLUCrp25NRrT70v8GNMHBr7DySwoKd2ELoxtQS5JADXO0qwbSh09HAy14V5RtCTfS1FgsiY3JQEgkMYaBwX0IhKuAa6j9GBj_1K3MTLVM8Afqc3h1_Q"
  },
  {
    title: "COMPUTER_WORLD",
    artist: "KRAFTWERK",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHLyx5uuqtzzSnwcf6rd2uAREIOzhjDmgFOeJvdVwwfUDbcNe-4CeMSzjHZTDnTF8VM6RXPy3IcPME9nCdV4MHu9H7nSx389pipdu2vj5Dgx-t8DxRhTgEfAR9jKIu21VkMUCwcTn3m52omXq127yYj2RwJMRBWQHWgfP8p6HR2rV1JBJwli_LNJFgRT5_K6im9TZpt_cA3YDoIOZJreVaeDMHUtlmlWLnavhgzl8DGNW4-MrLRISJcCHgnpCzoXmTjLovdKGL-LU"
  },
  {
    title: "MUSIC_FOR_AIRPORTS",
    artist: "BRIAN_ENO",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAWCY3bFyozStASO9fHP6teCN3mYIim_DjppTzYH3EpiUo-WKzhS3a5fWapfggFlzhs-ehHLKLwEqB23UKggZdHTV3-WoIx3jZnlKKl0UFnmQq7r7183nFt8J_QB7rk-Mfxl7B0gxlc50xiBv8T1vxtZ5MYc40-1cObVsbjCGHdAotN_4SUlVZyGTmivbX64s619tphynU09TrheRjFSSNRUzFKs6Fu4FY6tD7GWSOeFRO0t4ki_cskXVBkCoCZ50Q1R9kD3clEMM"
  },
  {
    title: "THE_MAN_MACHINE",
    artist: "KRAFTWERK",
    coverUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKUoowr6osL94_VAs7V2IbeQkp_YEsWoTb3pGW_skkKi5TsY8MBccAhU-zKg6d9LdoQWHAvSCzGGeMhLpJGoNIGANJb97dwyek_ocZtqaSmxDV-7fAyqmaQNN3Z0QGAdWZ2fJ2aCo4Rm6TjqAt2LAh-13jU5hVRFQX1R45GmB16YjSboryGa81ghbr83SVzeKjyw4TuQQHpJ2xdmLv3gI6sScm24gEETvu9V8qXI2jMC2vclvZ_q4Ezetbw2nYoS7bTipMAyiMMio"
  }
];

export const FRIEND_ACTIVITIES = [
  {
    name: "ISOMETRIC_GIRL",
    status: "Listening to:",
    detail: "ORBITAL_PATH",
    timeAgo: "2M_AGO",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKOy4iNXQNlHhKL9ABmdT8BFOEk-IKV8e22OnD0bwUqH45y1XDA3LyypfiS7EQjDdnfGjaU-whTD8aEyUz5_fIOM-pceNPgcr8RHkU1RLc-JkRY2601_xu6DEnoxEGQqvoVSxeiOcE0Xey_beLUp-ba-8lMfAfyNABJU8qBKRoO9VQk7Zi4KxYegOQynYtORSl-sjvGgI5kuCttPu9_kES5l9FO_SrZvANvptYdxA2WfMV7ldYTIP7PL4Xj3iFRoNprN7pZk0iCxo",
    active: true
  },
  {
    name: "LOW_PASS_FILTER",
    status: "Saved:",
    detail: "ANALOG_DREAMS",
    timeAgo: "15M_AGO",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrIHIprdKs-SxteKgTU2sWOkyu51TswExd1BZvxNdFGbLTtMapKNZ1_FXQIHrI8wvBe9nPVvbMb6uTS86Rm59MiOXgEEsyMPeBHWSEV4H6JN2v8kc8lJPHPv27wG1Td7ywH5U8P1Kw55s4QAAUCDp5X2GTp5DsFPqrEMKzl2DQ-P_wg6IQzZ4sKbC8pb_XCvSFohmaeSY2rc77Ib--EDG5t4CFTp8cME-RKZOfAuiPPKQs_DgbPlo9I-fu3WWuBcx7TK8NDrkjjbY",
    active: false
  },
  {
    name: "NOISE_GATE",
    status: "Last active:",
    detail: "4H_AGO",
    timeAgo: "4H_AGO",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0R-Xj486LL_hZQv94Gx1FvuzXwg36aIODRwasMLY_m1B1wCMw33OUHwFng6v2PTRHqsWKI0nVAYFlJ33DoHN1g9nsUrIIY2SM-skraxDD8b5CfKpbO2WZGccKULAvsKaAONm_CXUov2_XfuwyAOl9hjOVpLHF_W8y-zm7OoVo6uhObhlfrNcxkvqioVudZPS0Yg0cD9nGrNpPjMFvD0cBjU1Nskctuv1OwjD1bvwQCwV_YlAqnczmLDTLcTk12eIatwwlke4Vcc8",
    active: false
  }
];
