# Atualizacao OTA Valvula Pro

Este site publica os arquivos estaticos que o ESP32 usa para verificar e baixar atualizacoes.

## Pasta oficial

Edite somente esta pasta para publicar atualizacoes:

```text
public/valvula-pro/update/
```

Arquivos dessa pasta:

```text
public/valvula-pro/update/version.txt
public/valvula-pro/update/firmware.bin
public/valvula-pro/update/version.json
```

O `firmware.bin` nao fica criado no repositorio ate voce gerar o firmware real. Quando compilar a ESP32, copie o `.bin` gerado para essa pasta e renomeie para `firmware.bin`.

Use estes endpoints no firmware:

```cpp
const char UPDATE_VERSION_URL[] = "https://elntechnology.com/valvula-pro/update/version.txt";
const char UPDATE_FIRMWARE_URL[] = "https://elntechnology.com/valvula-pro/update/firmware.bin";
```

## O que editar

Para liberar uma versao nova:

1. Substitua ou coloque o binario em `public/valvula-pro/update/firmware.bin`.
2. Edite `public/valvula-pro/update/version.txt`.
3. Coloque somente a versao, sem texto extra.

Exemplo de `version.txt`:

```text
2.5.3
```

Opcionalmente, edite tambem `public/valvula-pro/update/version.json` para deixar notas da versao:

```json
{
  "version": "2.5.3",
  "url": "https://elntechnology.com/valvula-pro/update/firmware.bin",
  "notes": "Melhoria WiFi e bateria",
  "required": false
}
```

Enquanto nao houver firmware publicado, mantenha `version.txt` como `0.0.0` para evitar que aparelhos tentem baixar um arquivo inexistente.

## Historico de versoes

Se quiser guardar varias versoes antigas, use esta pasta separada:

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
