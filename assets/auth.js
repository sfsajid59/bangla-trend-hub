async function getCurrentUser() {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        return null;
    }

    return data.user;
}


async function isAdmin() {
    const { data, error } = await supabaseClient
        .rpc("is_admin");

    if (error) {
        console.error("Admin check failed:", error);
        return false;
    }

    return data === true;
}


async function requireAdmin() {
    const user = await getCurrentUser();

    if (!user) {
        window.location.href = "./login.html";
        return false;
    }

    const admin = await isAdmin();

    if (!admin) {
        alert("আপনার Admin access নেই।");
        await supabaseClient.auth.signOut();
        window.location.href = "./login.html";
        return false;
    }

    return true;
}


async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = "./login.html";
}
