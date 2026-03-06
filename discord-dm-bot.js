const { Client, GatewayIntentBits } = require('discord.js');

// ===== الإعدادات =====
const TOKEN = 'ضع_توكن_البوت_هنا';        // توكن البوت من Discord Developer Portal
const GUILD_ID = 'ضع_ايدي_السيرفر_هنا';   // ID السيرفر اللي تبي تراسل أعضاءه
const MAX_DMS = 20;                          // عدد الأعضاء اللي تبي تراسلهم
const DELAY_MS = 3000;                       // تأخير بين كل رسالة (3 ثواني) لتجنب الحظر

// ===== نص الرسالة =====
const MESSAGE = `مرحبا! 👋

انت تبحث على سيرفر **سياسي** و **العاب** و تقريبا كل محتوى؟

✅ فعاليات
✅ نقاشات سياسية
✅ قنوات الألعاب
✅ محتوى متنوع

**وايز توبيا** ترحب بكم! 🎉
🔗 https://discord.gg/mH9C3BuNYq`;

// ===== إنشاء الكلاينت =====
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// ===== دالة التأخير =====
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== الدالة الرئيسية =====
async function sendDMs() {
  try {
    console.log('⏳ جاري جلب السيرفر...');
    const guild = await client.guilds.fetch(GUILD_ID);

    console.log('⏳ جاري جلب الأعضاء...');
    const members = await guild.members.fetch();

    // فلترة البوتات وإزالتها
    const humanMembers = members.filter(m => !m.user.bot).map(m => m);

    console.log(`✅ تم جلب ${humanMembers.length} عضو بشري`);
    console.log(`📨 سيتم إرسال رسائل لـ ${Math.min(MAX_DMS, humanMembers.length)} عضو\n`);

    let sent = 0;
    let failed = 0;

    for (let i = 0; i < Math.min(MAX_DMS, humanMembers.length); i++) {
      const member = humanMembers[i];

      try {
        await member.send(MESSAGE);
        sent++;
        console.log(`✅ [${sent}] تم الإرسال لـ: ${member.user.tag}`);
      } catch (err) {
        failed++;
        console.log(`❌ فشل الإرسال لـ: ${member.user.tag} — (قد يكون أغلق الرسائل الخاصة)`);
      }

      // انتظر قبل الرسالة التالية
      if (i < MAX_DMS - 1) {
        await sleep(DELAY_MS);
      }
    }

    console.log(`\n🏁 انتهى!`);
    console.log(`✅ نجح: ${sent}`);
    console.log(`❌ فشل: ${failed}`);

    client.destroy();
    process.exit(0);

  } catch (err) {
    console.error('❌ حصل خطأ:', err.message);
    client.destroy();
    process.exit(1);
  }
}

// ===== تشغيل البوت =====
client.once('ready', () => {
  console.log(`🤖 البوت شغال: ${client.user.tag}\n`);
  sendDMs();
});

client.login(TOKEN).catch(err => {
  console.error('❌ فشل تسجيل الدخول:', err.message);
  process.exit(1);
});
