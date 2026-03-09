#!/usr/bin/env node

console.log('🚀 Instalando dependencias del frontend...\n');

const { execSync } = require('child_process');

try {
  console.log('📦 Instalando dependencias principales...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('\n✅ ¡Dependencias instaladas correctamente!');
  console.log('\n🎉 Para iniciar el servidor de desarrollo:');
  console.log('   npm run dev');
  console.log('\n🔧 Para construir para producción:');
  console.log('   npm run build');
  
} catch (error) {
  console.error('\n❌ Error instalando dependencias:', error.message);
  console.log('\n💡 Intenta ejecutar manualmente:');
  console.log('   npm install');
}