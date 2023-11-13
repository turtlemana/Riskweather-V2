import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import useSWR from "swr";
import axios from "axios";
import Header from "components/templates/m/profile/Header";
import Menu from "components/templates/m/profile/Menu";
import Footer from "components/layouts/m/Footer";

function Profile({ showToleranceModal }: { showToleranceModal: boolean }) {
  const router = useRouter();

  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data: session, status, update }: any = useSession();
  const {
    data: userInfo,
    isValidating,
    mutate,
  } = useSWR(`/api/auth/user?session=${session.user.email}`, fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  const userProfile: any = userInfo ? [].concat(userInfo.user)[0] : {};

  return (
    <main className=" min-w-[360px] h-auto ">
      <Header userProfile={userProfile} />
      <Menu userProfile={userProfile} mutate={mutate} />
      <Footer />
    </main>
  );
}

export default Profile;
