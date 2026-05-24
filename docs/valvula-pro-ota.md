# Atualizacao OTA Valvula Pro

Este site publica os arquivos estaticos que o ESP32 usa para verificar e baixar atualizacoes.

## Caminho simples

Use estes endpoints no firmware atual:

```cpp
const char UPDATE_VERSION_URL[] = "https://elntechnology.com/valvula-pro/update/version.txt";
const char UPDATE_FIRMWARE_URL[] = "https://elntechnology.com/valvula-pro/update/firmware.bin";
```

Arquivos no projeto:

```text
public/valvula-pro/update/version.txt
public/valvula-pro/update/firmware.bin
```

O `version.txt` deve conter somente a versao publicada, por exemplo:

```text
2.5.3
```

Quando quiser liberar uma atualizacao:

1. Gere o binario do firmware.
2. Coloque o arquivo como `public/valvula-pro/update/firmware.bin`.
3. Atualize `public/valvula-pro/update/version.txt` para a nova versao.
4. Faca o deploy do site.

Enquanto nao houver firmware publicado, mantenha `version.txt` como `0.0.0` para evitar que aparelhos tentem baixar um arquivo inexistente.

## Caminho com manifesto

Tambem existe a estrutura para uma versao mais profissional:

```text
public/update/valvula-pro/version.json
public/update/valvula-pro/firmware-2.5.3.bin
```

Exemplo de `version.json`:

```json
{
  "version": "2.5.3",
  "url": "https://elntechnology.com/update/valvula-pro/firmware-2.5.3.bin",
  "notes": "Melhoria WiFi e bateria",
  "required": false
}
```

## Checklist do firmware

Antes de atualizar, o aparelho deve verificar:

1. WiFi conectado em roteador, nao apenas em modo AP.
2. Bateria acima do minimo ou carregando.
3. Versao online maior que `APP_VERSAO`.
4. Usuario confirmou no botao OK.
5. Arquivo baixado com tamanho valido antes da gravacao.
